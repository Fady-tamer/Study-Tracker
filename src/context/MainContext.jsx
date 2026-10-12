/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const mainStore = createContext();

// Helper to safely read from localStorage
const getStoredItem = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
};

const MainContext = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);

  // Courses state
  const [courses, setCourses] = useState(() => getStoredItem("courses"));
  const [showAddCourse, setShowAddCourse] = useState(false);

  const saveCourses = (fetchedCourses) => {
    const updated = fetchedCourses || [];
    localStorage.setItem("courses", JSON.stringify(updated));
    setCourses(updated);
  };

  // Assignments state
  const [assignments, setAssignments] = useState(() =>
    getStoredItem("assignments"),
  );
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [addAssignmentInitialDate, setAddAssignmentInitialDate] = useState("");

  const saveAssignments = (fetchedAssignments) => {
    const updated = fetchedAssignments || [];
    localStorage.setItem("assignments", JSON.stringify(updated));
    setAssignments(updated);
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        const merged = data.map((c) => {
          try {
            const stored = localStorage.getItem(`chapters_${c.id}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                return {
                  ...c,
                  done_chapters: parsed.length,
                  status: c.total_chapters > 0 && parsed.length >= c.total_chapters ? "Completed" : "In Progress",
                };
              }
            }
          } catch {}
          return c;
        });
        saveCourses(merged);
        return merged;
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
    return [];
  };

  const deleteCourse = async (courseId) => {
    try {
      // 1. Get chapters for this course
      const { data: chaptersData } = await supabase
        .from("chapters")
        .select("id")
        .eq("course_id", courseId);

      const chapterIds = (chaptersData || []).map((ch) => ch.id);

      // 2. Delete tasks for these chapters
      if (chapterIds.length > 0) {
        await supabase.from("tasks").delete().in("chapter_id", chapterIds);
      }

      // 3. Delete chapters
      await supabase.from("chapters").delete().eq("course_id", courseId);

      // 4. Delete assignments for this course
      await supabase.from("assignments").delete().eq("course_id", courseId);

      // 5. Delete the course itself
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      // Clean local storage cache
      localStorage.removeItem(`chapters_${courseId}`);

      // Update state in MainContext
      const updatedCourses = (courses || []).filter((c) => c.id !== courseId);
      saveCourses(updatedCourses);

      const updatedAssignments = (assignments || []).filter(
        (a) => (a.course_id || a.courses?.id) !== courseId
      );
      saveAssignments(updatedAssignments);

      return { success: true };
    } catch (err) {
      console.error("Failed to delete course:", err);
      return { success: false, error: err.message };
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select(
          `
          id,
          assignment_name,
          deadline,
          isDone,
          courses (
            id,
            topic_name
          )`
        )
        .order("deadline", { ascending: true });

      if (!error && data) {
        saveAssignments(data);
        return data;
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
    return [];
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
      if (user) {
        fetchCourses();
        fetchAssignments();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchCourses();
        fetchAssignments();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Comprehensive Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase sign out error:", err);
    } finally {
      // Clear all cached application items
      localStorage.removeItem("courses");
      localStorage.removeItem("assignments");
      setCourses([]);
      setAssignments([]);
      setUser(null);
    }
  };

  const contextValue = {
    user,
    setUser,
    showAddCourse,
    setShowAddCourse,
    courses,
    saveCourses,
    fetchCourses,
    deleteCourse,
    showAddAssignment,
    setShowAddAssignment,
    addAssignmentInitialDate,
    setAddAssignmentInitialDate,
    assignments,
    saveAssignments,
    fetchAssignments,
    logout,
  };

  return (
    <mainStore.Provider value={contextValue}>{children}</mainStore.Provider>
  );
};

export default MainContext;
