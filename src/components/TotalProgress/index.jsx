import { useContext } from "react";

// context
import { mainStore } from "../../context/MainContext";

const TotalProgress = ({ className }) => {
  const { courses } = useContext(mainStore);

  const totals = courses.reduce(
    (acc, course) => ({
      total: acc.total + (course.total_chapters || 0),
      completed: acc.completed + (course.done_chapters || 0),
    }),
    { total: 0, completed: 0 },
  );

  const percentage =
    totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;

  return (
    <div
      className={`p-4 flex flex-col gap-6 justify-center items-center rounded-2xl border border-surface-border ${className}`}
    >
      <p className="xl:text-2xl font-bold">Total Courses Progress</p>
      <p className="xl:text-2xl font-bold">{percentage}%</p>

      <div className="w-[80%] h-6 rounded-2xl border border-surface-border overflow-hidden bg-gray-100">
        <div
          className="h-6 rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default TotalProgress;
