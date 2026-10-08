import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";

// components
import ProgressBar from "../ProgressBar";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

const CoursesTable = ({ className }) => {
  const { courses, saveCourses, showAddCourse, setShowAddCourse } =
    useContext(mainStore);

  const navigateTo = useNavigate();

  const courseDetails = (courseName) => {
    navigateTo("/myCourses/" + courseName);
  };

  const calcProgress = (total, done) => {
    return Number((done / total) * 100).toFixed(0);
  };

  const calcStatus = (total, done) => {
    if (total == done) return "Completed";
    else return "in progress";
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    saveCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div
      className={`coursesTable rounded-xl overflow-hidden overflow-y-scroll border border-surface-border ${className}`}
    >
      {courses?.length > 0 ? (
        <table className="w-full">
          <thead className="text-sm xl:text-base text-white bg-brand-light">
            <tr>
              <th className="p-4">Topic Name</th>
              <th className="p-4">Total Time (hr)</th>
              <th className="p-4">Number oh Chapters</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-Typography-primary text-center">
            {courses.map(
              ({
                id,
                topic_name,
                total_time,
                total_chapters,
                done_chapters,
              }) => {
                return (
                  <tr
                    key={id}
                    onClick={() => {
                      courseDetails(topic_name);
                    }}
                    className="border-b border-surface-border cursor-pointer duration-300 hover:ease-in-out hover:scale-95"
                  >
                    <td className="px-4 py-6 font-semibold capitalize">
                      {topic_name}
                    </td>
                    <td className="px-4 py-6 font-semibold capitalize">
                      {total_time}
                    </td>
                    <td className="px-4 py-6 font-semibold capitalize">
                      {total_chapters}
                    </td>
                    <td>
                      <ProgressBar
                        progress={calcProgress(total_chapters, done_chapters)}
                      />
                    </td>
                    <td>
                      <div
                        className={`w-fit mx-auto px-4 py-2 flex items-center gap-4 rounded-2xl border border-surface-border`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${calcStatus(total_chapters, done_chapters) == "in progress" ? "bg-yellow-300" : "bg-green-500"}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full py-16 px-4 flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-medium text-Typography-primary">
            Add Courses to show here
          </p>

          <button
            onClick={() => {
              console.log(showAddCourse);

              setShowAddCourse(!showAddCourse);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Add Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;
