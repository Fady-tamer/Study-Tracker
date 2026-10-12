import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";

// icons
import { IoBookOutline, IoChevronForward } from "react-icons/io5";
import { BiTimeFive, BiPlus, BiTrash } from "react-icons/bi";
import toast from "react-hot-toast";

// components
import ProgressBar from "../ProgressBar";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

// utils
import {
  calcProgress,
  calcStatus,
  formatStudyTime,
  getCourseDoneChapters,
} from "../../utils";

const CoursesTable = ({ className = "" }) => {
  const { courses, saveCourses, setShowAddCourse, deleteCourse } =
    useContext(mainStore);
  const [loading, setLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleCourseClick = (courseName) => {
    navigate(`/myCourses/${encodeURIComponent(courseName)}`);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    const res = await deleteCourse(courseToDelete.id);
    setIsDeleting(false);
    if (res?.success) {
      toast.success(`Course "${courseToDelete.topic_name}" deleted`);
      setCourseToDelete(null);
    } else {
      toast.error(res?.error || "Failed to remove course");
    }
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      const merged = data.map((c) => {
        const done = getCourseDoneChapters(c.id, c.done_chapters);
        return {
          ...c,
          done_chapters: done,
          status: c.total_chapters > 0 && done >= c.total_chapters ? "Completed" : "In Progress",
        };
      });
      saveCourses(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div
      className={`coursesTable overflow-x-auto rounded-xl border border-surface-border bg-white shadow-xs ${className}`}
    >
      {loading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-center justify-between gap-4 py-2">
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-4 w-1/6 rounded bg-slate-100" />
              <div className="h-3 w-1/4 rounded bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : courses?.length > 0 ? (
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-Typography-muted">
              <th className="px-5 py-3.5">Course / Topic</th>
              <th className="hidden px-5 py-3.5 text-center lg:table-cell">Study Time</th>
              <th className="hidden px-5 py-3.5 text-center md:table-cell">Chapters</th>
              <th className="min-w-[160px] px-5 py-3.5">Progress</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="w-10 px-4 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {courses.map(
              ({
                id,
                topic_name,
                total_time,
                total_chapters,
                done_chapters = 0,
              }) => {
                const actualDone = getCourseDoneChapters(id, done_chapters);
                const status = calcStatus(total_chapters, actualDone);
                const progress = calcProgress(total_chapters, actualDone);
                const isComplete = status === "Completed";

                return (
                  <tr
                    key={id}
                    onClick={() => handleCourseClick(topic_name)}
                    className="group cursor-pointer transition-colors hover:bg-indigo-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                          <IoBookOutline className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-Typography-primary capitalize block group-hover:text-brand-primary transition-colors">
                            {topic_name}
                          </span>
                          <span className="text-[11px] text-Typography-muted md:hidden">
                            {actualDone}/{total_chapters} Chapters
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-5 py-4 text-center text-xs font-semibold text-Typography-secondary lg:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <BiTimeFive className="text-sm text-Typography-muted" />
                        {formatStudyTime(total_time)}
                      </span>
                    </td>

                    <td className="hidden px-5 py-4 text-center text-xs font-semibold text-Typography-secondary md:table-cell">
                      <span>{done_chapters}</span>
                      <span className="text-Typography-muted"> / {total_chapters}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-Typography-primary">{progress}%</span>
                        </div>
                        <ProgressBar
                          progress={progress}
                          height="h-2"
                          color={isComplete ? "from-emerald-500 to-teal-400" : "from-brand-primary to-indigo-400"}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
                          isComplete
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isComplete ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseToDelete({ id, topic_name });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title={`Delete ${topic_name}`}
                        >
                          <BiTrash className="text-base" />
                        </button>
                        <IoChevronForward className="text-base text-Typography-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-brand-primary">
            <IoBookOutline className="text-2xl" />
          </div>
          <div>
            <h4 className="text-base font-bold text-Typography-primary">
              No Courses Yet
            </h4>
            <p className="mt-1 text-xs text-Typography-secondary max-w-sm">
              Create your first course to begin organizing your chapters, assignments, and study sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 cursor-pointer"
          >
            <BiPlus className="text-lg" />
            <span>Create Course</span>
          </button>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div
          onClick={() => !isDeleting && setCourseToDelete(null)}
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
                "{courseToDelete.topic_name}"
              </strong>
              ? This action will permanently remove this course and all associated chapters, tasks, and deadlines.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-Typography-secondary hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-rose-600/25 active:scale-95"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;
