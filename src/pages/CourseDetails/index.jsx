import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

// icons
import {
  BiArrowBack,
  BiTimeFive,
  BiTask,
  BiTimer,
  BiTrash,
  BiPlus,
} from "react-icons/bi";
import { BsCheckSquareFill, BsSquare } from "react-icons/bs";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

// components
import ProgressBar from "../../components/ProgressBar";
import Timer from "./components/Timer";
import ChaptersList from "./components/ChaptersList";

// utils
import { formatStudyTime, formatDeadline as formatAssignmentDate } from "../../utils";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, saveCourses, assignments, saveAssignments, deleteCourse } =
    useContext(mainStore);

  const [course, setCourse] = useState(null);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);

  const fetchCourseData = async () => {
    try {
      const decodedParam = decodeURIComponent(id || "");
      const isUUID = /^[0-9a-fA-F-]{36}$/.test(decodedParam);

      // Check if course already exists in global store
      const matchFromStore = (courses || []).find(
        (c) =>
          c.id === decodedParam ||
          c.topic_name?.toLowerCase() === decodedParam.toLowerCase(),
      );

      let courseData = null;

      if (matchFromStore?.id) {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", matchFromStore.id)
          .maybeSingle();

        courseData = (!error && data) ? data : matchFromStore;
      } else {
        const query = supabase.from("courses").select("*");
        const { data, error } = isUUID
          ? await query.eq("id", decodedParam).maybeSingle()
          : await query.ilike("topic_name", decodedParam).limit(1).maybeSingle();

        if (error) throw error;
        courseData = data;
      }

      if (!courseData) {
        setCourse(null);
        return;
      }

      // Restore specific checked chapters from localStorage or fallback
      let restoredChapters = null;
      try {
        const stored = localStorage.getItem(`chapters_${courseData.id}`);
        if (stored) restoredChapters = JSON.parse(stored);
      } catch {
        restoredChapters = null;
      }

      const activeDone = Array.isArray(restoredChapters) && restoredChapters.length > 0
        ? restoredChapters
        : Array.from(
            { length: courseData.done_chapters || 0 },
            (_, idx) => idx + 1,
          );

      setCompletedChapters(activeDone);

      const actualDoneCount = activeDone.length;
      const isComplete =
        courseData.total_chapters > 0 && actualDoneCount >= courseData.total_chapters;
      const updatedCourseObj = {
        ...courseData,
        done_chapters: actualDoneCount,
        status: isComplete ? "Completed" : "In Progress",
      };

      setCourse(updatedCourseObj);

      if (courses) {
        saveCourses(
          courses.map((c) => (c.id === courseData.id ? updatedCourseObj : c)),
        );
      }

      if (courseData?.id) {
        // 1. Fetch chapters and their nested tasks
        const { data: dbChapters, error: chaptersError } = await supabase
          .from("chapters")
          .select("*, tasks(*)")
          .eq("course_id", courseData.id)
          .order("order_index", { ascending: true });

        if (!chaptersError && dbChapters && dbChapters.length > 0) {
          const sortedChapters = dbChapters.map((ch) => ({
            ...ch,
            tasks: (ch.tasks || []).sort(
              (a, b) => (a.order_index || 0) - (b.order_index || 0),
            ),
          }));
          setChapters(sortedChapters);
        } else if (courseData.total_chapters > 0) {
          // Auto-initialize chapters for this course in Supabase
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const initialToInsert = Array.from(
              { length: courseData.total_chapters || 1 },
              (_, idx) => ({
                course_id: courseData.id,
                user_id: user.id,
                title: `Chapter ${idx + 1}`,
                order_index: idx + 1,
                is_done: (activeDone || []).includes(idx + 1),
              }),
            );
            const { data: created, error: createErr } = await supabase
              .from("chapters")
              .insert(initialToInsert)
              .select("*, tasks(*)")
              .order("order_index", { ascending: true });

            if (!createErr && created) {
              setChapters(created);
            }
          }
        }

        // 2. Fetch course assignments
        const { data: assignmentsData, error: assignError } = await supabase
          .from("assignments")
          .select("*")
          .eq("course_id", courseData.id)
          .order("deadline", { ascending: true });

        if (!assignError) setCourseAssignments(assignmentsData || []);
      }
    } catch (err) {
      console.error("Error loading course details:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleTimerComplete = async (minutesEarned) => {
    if (!course) return;

    const currentMinutes = Number(course.total_time) || 0;
    const updatedMinutes = currentMinutes + minutesEarned;

    setCourse((prev) => ({
      ...prev,
      total_time: updatedMinutes,
    }));

    if (courses) {
      saveCourses(
        courses.map((c) =>
          c.id === course.id ? { ...c, total_time: updatedMinutes } : c,
        ),
      );
    }

    toast.success(`Logged ${minutesEarned} mins of focus! ⏱️`);

    const { error } = await supabase
      .from("courses")
      .update({ total_time: updatedMinutes })
      .eq("id", course.id);

    if (error) {
      console.error("Failed to sync study time:", error.message);
      toast.error("Could not sync total study time.");
    }
  };

  const handleToggleChapter = async (chapterId, currentStatus) => {
    if (!course) return;
    const nextStatus = !currentStatus;

    // Optimistically update chapters list
    const updated = chapters.map((ch) =>
      ch.id === chapterId ? { ...ch, is_done: nextStatus } : ch,
    );
    setChapters(updated);

    const doneCount = updated.filter((ch) => ch.is_done).length;
    const isCompleted =
      course.total_chapters > 0 && doneCount >= course.total_chapters;
    const newStatus = isCompleted ? "Completed" : "In Progress";
    const dbStatus = isCompleted ? "completed" : "in progress";

    const updatedCourseObj = {
      ...course,
      done_chapters: doneCount,
      status: newStatus,
    };
    setCourse(updatedCourseObj);

    if (courses) {
      saveCourses(
        courses.map((c) => (c.id === course.id ? updatedCourseObj : c)),
      );
    }

    // Cache completed indices in localStorage
    const doneIndices = updated
      .filter((ch) => ch.is_done)
      .map((ch) => ch.order_index || ch.id);
    localStorage.setItem(
      `chapters_${course.id}`,
      JSON.stringify(doneIndices),
    );
    setCompletedChapters(doneIndices);

    toast.success(nextStatus ? "Chapter completed! 🎉" : "Chapter marked in progress");

    try {
      await supabase
        .from("chapters")
        .update({ is_done: nextStatus })
        .eq("id", chapterId);

      const { error } = await supabase
        .from("courses")
        .update({
          done_chapters: doneCount,
          status: dbStatus,
        })
        .eq("id", course.id);

      if (error) {
        await supabase
          .from("courses")
          .update({ done_chapters: doneCount })
          .eq("id", course.id);
      }
    } catch (err) {
      console.error("Error syncing chapter completion to Supabase:", err);
    }
  };

  const handleAddTask = async (chapterId, title) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please log in to add tasks");

      const targetChapter = chapters.find((ch) => ch.id === chapterId);
      const orderIndex = (targetChapter?.tasks?.length || 0) + 1;

      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            chapter_id: chapterId,
            user_id: user.id,
            title: title.trim(),
            order_index: orderIndex,
            is_done: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId
            ? { ...ch, tasks: [...(ch.tasks || []), data] }
            : ch,
        ),
      );

      toast.success("Task added to chapter!");
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error(err.message || "Failed to add task");
    }
  };

  const handleToggleTask = async (taskId, chapterId, currentStatus) => {
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          const updatedTasks = (ch.tasks || []).map((t) =>
            t.id === taskId ? { ...t, is_done: nextStatus } : t,
          );
          return { ...ch, tasks: updatedTasks };
        }
        return ch;
      }),
    );

    toast.success(nextStatus ? "Task completed! 🎉" : "Task marked pending");

    const { error } = await supabase
      .from("tasks")
      .update({ is_done: nextStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to sync task status");
      fetchCourseData();
    }
  };

  const handleDeleteTask = async (taskId, chapterId) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            tasks: (ch.tasks || []).filter((t) => t.id !== taskId),
          };
        }
        return ch;
      }),
    );

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      toast.error("Failed to delete task");
      fetchCourseData();
    } else {
      toast.success("Task removed");
    }
  };

  const handleAddChapter = async (title) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please log in to add chapters");

      const nextOrder = chapters.length + 1;
      const { data, error } = await supabase
        .from("chapters")
        .insert([
          {
            course_id: course.id,
            user_id: user.id,
            title: title.trim(),
            order_index: nextOrder,
            is_done: false,
          },
        ])
        .select("*, tasks(*)")
        .single();

      if (error) throw error;

      const updatedChapters = [...chapters, { ...data, tasks: [] }];
      setChapters(updatedChapters);

      const newTotal = updatedChapters.length;
      const updatedCourseObj = {
        ...course,
        total_chapters: newTotal,
      };
      setCourse(updatedCourseObj);

      if (courses) {
        saveCourses(
          courses.map((c) => (c.id === course.id ? updatedCourseObj : c)),
        );
      }

      await supabase
        .from("courses")
        .update({ total_chapters: newTotal })
        .eq("id", course.id);

      toast.success("Chapter created!");
    } catch (err) {
      toast.error(err.message || "Failed to create chapter");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    const updatedChapters = chapters.filter((ch) => ch.id !== chapterId);
    setChapters(updatedChapters);

    const newTotal = updatedChapters.length;
    const doneCount = updatedChapters.filter((c) => c.is_done).length;
    const isCompleted = newTotal > 0 && doneCount >= newTotal;
    const newStatus = isCompleted ? "Completed" : "In Progress";
    const dbStatus = isCompleted ? "completed" : "in progress";

    const updatedCourseObj = {
      ...course,
      total_chapters: newTotal,
      done_chapters: doneCount,
      status: newStatus,
    };
    setCourse(updatedCourseObj);

    if (courses) {
      saveCourses(
        courses.map((c) => (c.id === course.id ? updatedCourseObj : c)),
      );
    }

    try {
      await supabase.from("chapters").delete().eq("id", chapterId);
      await supabase
        .from("courses")
        .update({
          total_chapters: newTotal,
          done_chapters: doneCount,
          status: dbStatus,
        })
        .eq("id", course.id);

      toast.success("Chapter removed");
    } catch (err) {
      console.error("Failed to delete chapter:", err);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignmentName.trim() || !course?.id) return;

    setIsAddingAssignment(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please log in to add assignments");

      const isoDeadline = newDeadline
        ? new Date(newDeadline).toISOString()
        : null;

      const { data, error } = await supabase
        .from("assignments")
        .insert([
          {
            user_id: user.id,
            course_id: course.id,
            assignment_name: newAssignmentName.trim(),
            deadline: isoDeadline,
            isDone: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const dataWithCourse = {
        ...data,
        courses: { id: course.id, topic_name: course.topic_name },
      };

      setCourseAssignments((prev) => [...prev, dataWithCourse]);
      if (assignments) {
        saveAssignments([...assignments, dataWithCourse]);
      }

      setNewAssignmentName("");
      setNewDeadline("");
      toast.success("Assignment added!");
    } catch (err) {
      toast.error(err.message || "Failed to add assignment");
    } finally {
      setIsAddingAssignment(false);
    }
  };

  const toggleAssignmentDone = async (assignmentId, currentStatus) => {
    const nextStatus = !currentStatus;

    setCourseAssignments((prev) =>
      prev.map((item) =>
        item.id === assignmentId ? { ...item, isDone: nextStatus } : item,
      ),
    );

    if (assignments) {
      saveAssignments(
        assignments.map((item) =>
          item.id === assignmentId ? { ...item, isDone: nextStatus } : item,
        ),
      );
    }

    toast.success(
      nextStatus ? "Assignment completed! 🎉" : "Marked as pending",
    );

    const { error } = await supabase
      .from("assignments")
      .update({ isDone: nextStatus })
      .eq("id", assignmentId);

    if (error) {
      toast.error("Failed to update status");
      setCourseAssignments((prev) =>
        prev.map((item) =>
          item.id === assignmentId ? { ...item, isDone: currentStatus } : item,
        ),
      );
      if (assignments) {
        saveAssignments(
          assignments.map((item) =>
            item.id === assignmentId ? { ...item, isDone: currentStatus } : item,
          ),
        );
      }
    }
  };

  const deleteAssignment = async (assignmentId) => {
    setCourseAssignments((prev) =>
      prev.filter((item) => item.id !== assignmentId),
    );

    if (assignments) {
      saveAssignments(assignments.filter((item) => item.id !== assignmentId));
    }

    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) {
      toast.error("Failed to delete assignment");
      fetchCourseData();
    } else {
      toast.success("Assignment removed");
    }
  };

  const handleDeleteCourse = async () => {
    if (!course?.id) return;
    setIsDeletingCourse(true);
    const res = await deleteCourse(course.id);
    setIsDeletingCourse(false);
    if (res?.success) {
      toast.success(`Course "${course.topic_name}" deleted`);
      navigate("/myCourses");
    } else {
      toast.error(res?.error || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="grow p-6 flex items-center justify-center text-sm text-Typography-secondary">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="grow p-6 flex flex-col items-center justify-center gap-4 text-Typography-secondary">
        <p>Course not found</p>
        <button
          onClick={() => navigate("/myCourses")}
          className="text-brand-primary underline"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const totalChaptersCount =
    chapters.length > 0 ? chapters.length : course.total_chapters || 0;
  const completedChaptersCount =
    chapters.length > 0
      ? chapters.filter((c) => c.is_done).length
      : completedChapters.length;

  const progress =
    totalChaptersCount > 0
      ? Math.round((completedChaptersCount / totalChaptersCount) * 100)
      : 0;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex w-full min-w-0 flex-col gap-6 rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 lg:p-8 shadow-xs">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer rounded-xl border border-surface-border bg-white p-2.5 text-Typography-secondary transition-all hover:bg-slate-50 hover:text-Typography-primary hover:border-slate-300 shadow-xs active:scale-95"
              title="Go Back"
            >
              <BiArrowBack className="text-xl" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold capitalize text-Typography-primary font-['Outfit']">
                  {course.topic_name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${
                    course.status?.toLowerCase() === "completed" ||
                    (course.total_chapters > 0 && completedChapters.length >= course.total_chapters)
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-indigo-50 text-brand-primary ring-brand-primary/20"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      course.status?.toLowerCase() === "completed" ||
                      (course.total_chapters > 0 && completedChapters.length >= course.total_chapters)
                        ? "bg-emerald-500"
                        : "bg-brand-primary"
                    }`}
                  />
                  {course.status?.toLowerCase() === "completed" ||
                  (course.total_chapters > 0 && completedChapters.length >= course.total_chapters)
                    ? "Completed"
                    : "In Progress"}
                </span>
              </div>
              <p className="text-xs text-Typography-muted mt-0.5">
                Detailed syllabus breakdown and dedicated pomodoro focus timer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/50 px-3.5 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100/70 hover:border-rose-300 active:scale-95 cursor-pointer shadow-xs"
              title="Delete this course"
            >
              <BiTrash className="text-base" />
              <span>Delete Course</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-Typography-muted">
                Course Progress
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {completedChapters.length}/{course.total_chapters} Ch.
              </span>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-emerald-600 font-['Outfit']">
                {progress}%
              </span>
            </div>
            <ProgressBar
              progress={progress}
              height="h-2.5"
              color="from-emerald-500 to-teal-400"
            />
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white to-indigo-50/30 p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-Typography-muted">
              Chapters Completed
            </span>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-Typography-primary font-['Outfit']">
                {completedChapters.length}
              </span>
              <span className="text-sm font-semibold text-Typography-muted">
                / {course.total_chapters} Total
              </span>
            </div>
            <span className="text-[11px] text-Typography-secondary">
              {course.total_chapters - completedChapters.length} remaining to finish
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white to-blue-50/30 p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-Typography-muted">
              Time Studied
            </span>
            <div className="my-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
                <BiTimeFive className="text-2xl" />
              </div>
              <span className="text-3xl font-extrabold text-Typography-primary font-['Outfit']">
                {formatStudyTime(course.total_time)}
              </span>
            </div>
            <span className="text-[11px] text-Typography-secondary">
              Logged via Pomodoro focus timer
            </span>
          </div>
        </div>

        {/* Chapters & Tasks Breakdown */}
        <ChaptersList
          chapters={chapters}
          course={course}
          onToggleChapter={handleToggleChapter}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
        />

        {/* Timer & Course Assignments */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Study Timer */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BiTimer className="text-xl text-brand-primary" />
              <h2 className="text-base font-bold text-Typography-primary font-['Outfit']">
                Integrated Study Timer
              </h2>
            </div>
            <Timer onComplete={handleTimerComplete} />
          </div>

          {/* Course Assignments List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BiTask className="text-xl text-brand-primary" />
                <h2 className="text-base font-bold text-Typography-primary font-['Outfit']">
                  Course Assignments ({courseAssignments.length})
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleAddAssignment}
              className="flex flex-col gap-2.5 rounded-2xl border border-surface-border bg-white p-3.5 shadow-xs"
            >
              <input
                type="text"
                placeholder="New assignment title..."
                value={newAssignmentName}
                onChange={(e) => setNewAssignmentName(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-slate-50 px-3.5 py-2.5 text-sm text-Typography-primary focus:border-brand-primary focus:bg-white focus:outline-none transition-colors"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-surface-border bg-slate-50 px-3 py-2 text-xs text-Typography-secondary focus:border-brand-primary focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isAddingAssignment || !newAssignmentName.trim()}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <BiPlus className="text-lg" />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {courseAssignments.length > 0 ? (
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-xs">
                {courseAssignments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-4 text-sm transition-colors hover:bg-slate-50/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          toggleAssignmentDone(item.id, item.isDone)
                        }
                        className="shrink-0 cursor-pointer text-base"
                        title={item.isDone ? "Mark as pending" : "Mark as done"}
                      >
                        {item.isDone ? (
                          <BsCheckSquareFill className="text-emerald-500" />
                        ) : (
                          <BsSquare className="text-slate-300 hover:text-brand-primary" />
                        )}
                      </button>

                      <div className="flex min-w-0 flex-col">
                        <span
                          className={`truncate font-semibold capitalize ${
                            item.isDone
                              ? "text-Typography-muted line-through opacity-70"
                              : "text-Typography-primary"
                          }`}
                        >
                          {item.assignment_name}
                        </span>
                        {item.deadline && (
                          <span className="text-xs font-medium text-rose-500">
                            Due: {formatAssignmentDate(item.deadline)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteAssignment(item.id)}
                      className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      title="Delete assignment"
                    >
                      <BiTrash className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-surface-border bg-slate-50/50 p-8 text-center text-sm text-Typography-muted">
                No assignments linked to this course yet. Use the form above to add one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Course Confirmation Modal */}
      {showDeleteModal && (
        <div
          onClick={() => !isDeletingCourse && setShowDeleteModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <BiTrash className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-Typography-primary font-['Outfit']">
                  Delete Course
                </h3>
                <p className="text-xs text-Typography-muted">
                  Permanent curriculum removal
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-Typography-secondary leading-relaxed mt-2">
              Are you sure you want to delete{" "}
              <strong className="text-Typography-primary capitalize">
                "{course.topic_name}"
              </strong>
              ? This action will permanently remove this course and all associated chapters, tasks, and deadlines.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeletingCourse}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-Typography-secondary hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingCourse}
                onClick={handleDeleteCourse}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-rose-600/25 active:scale-95"
              >
                {isDeletingCourse ? "Deleting..." : "Yes, Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
