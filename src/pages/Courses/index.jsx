import { useContext } from "react";
import { BiPlus } from "react-icons/bi";
import { IoBookOutline } from "react-icons/io5";

// components
import { CoursesTable, AddCourse } from "../../components";

// context
import { mainStore } from "../../context/MainContext";

const CoursesPage = () => {
  const { setShowAddCourse, courses } = useContext(mainStore);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
                <IoBookOutline className="text-lg" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
                My Courses
              </h1>
              {courses?.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-Typography-secondary">
                  {courses.length}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
              Monitor individual curriculum progress, completed chapters, and logged study hours.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCourse(true)}
            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 sm:w-auto cursor-pointer"
          >
            <BiPlus className="text-lg" />
            <span>Add Course</span>
          </button>
        </div>

        <CoursesTable />
      </div>

      <AddCourse />
    </div>
  );
};

export default CoursesPage;
