import { useContext } from "react";

// icons
import { BiTrendingUp } from "react-icons/bi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

// context
import { mainStore } from "../../context/MainContext";
import ProgressBar from "../ProgressBar";

// utils
import { getCourseDoneChapters } from "../../utils";

const TotalProgress = ({ className = "" }) => {
  const { courses } = useContext(mainStore);

  const getCourseDone = (course) =>
    getCourseDoneChapters(course?.id, course?.done_chapters);

  const totals = (courses || []).reduce(
    (acc, course) => ({
      total: acc.total + (Number(course?.total_chapters) || 0),
      completed: acc.completed + getCourseDone(course),
    }),
    { total: 0, completed: 0 },
  );

  const percentage =
    totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;

  const totalCourses = courses?.length || 0;
  const completedCourses =
    courses?.filter((c) => {
      const done = getCourseDone(c);
      return c.total_chapters > 0 && done >= c.total_chapters;
    })?.length || 0;

  return (
    <div
      className={`relative overflow-hidden flex min-w-0 flex-1 flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white via-white to-slate-50/60 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Decorative ambient background accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand-primary/5 blur-2xl" />

      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
              <BiTrendingUp className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-Typography-primary">
                Curriculum Progress
              </h3>
              <p className="text-xs text-Typography-muted">
                Across all enrolled courses
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
            <IoCheckmarkDoneCircleOutline className="text-sm" />
            {completedCourses}/{totalCourses} Done
          </span>
        </div>

        <div className="my-5 flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
            {percentage}%
          </span>
          <span className="text-xs font-medium text-Typography-secondary">
            completed of overall syllabus
          </span>
        </div>

        <div className="w-full">
          <ProgressBar
            progress={percentage}
            height="h-3"
            color="from-brand-primary via-indigo-500 to-emerald-400"
          />
        </div>
      </div>

      {/* Mini stats breakdown footer */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
        <div className="flex flex-col">
          <span className="text-Typography-muted font-medium">Chapters Finished</span>
          <span className="font-bold text-Typography-primary text-sm">
            {totals.completed} <span className="text-Typography-muted font-normal">/ {totals.total}</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-Typography-muted font-medium">Active Topics</span>
          <span className="font-bold text-Typography-primary text-sm">
            {totalCourses} Courses
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalProgress;
