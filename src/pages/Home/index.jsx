import { useContext } from "react";
import { BiPlus } from "react-icons/bi";
import { MdOutlineAssignment } from "react-icons/md";

// components
import {
  CoursesTable,
  TotalProgress,
  UpComingAssignment,
  CalendarPreview,
  AddCourse,
  AddAssignment,
} from "../../components";

// context
import { mainStore } from "../../context/MainContext";

const Home = () => {
  const { setShowAddCourse, setShowAddAssignment } = useContext(mainStore);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-surface-border bg-gradient-to-r from-surface-panel via-surface-panel to-indigo-50/30 p-5 sm:p-6 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
            Student Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
            Keep track of your learning curve, deadlines, and active study hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddAssignment(true)}
            className="flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-Typography-primary shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 cursor-pointer"
          >
            <MdOutlineAssignment className="text-base text-brand-primary" />
            <span>Assignment</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 cursor-pointer"
          >
            <BiPlus className="text-lg" />
            <span>Course</span>
          </button>
        </div>
      </div>

      {/* Analytics & Calendar Overview Row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="grid gap-4">
          <TotalProgress />
          <UpComingAssignment />
        </div>
        <CalendarPreview />
      </div>

      {/* Courses Section */}
      <div className="rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-Typography-primary font-['Outfit']">
              Enrolled Courses
            </h2>
            <p className="text-xs text-Typography-muted">
              Select any course to view chapters and start study sessions
            </p>
          </div>
        </div>

        <CoursesTable />
      </div>

      {/* Modals */}
      <AddCourse />
      <AddAssignment />
    </div>
  );
};

export default Home;
