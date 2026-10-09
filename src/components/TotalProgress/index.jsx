import { useContext } from "react";

// context
import { mainStore } from "../../context/MainContext";
import ProgressBar from "../ProgressBar";

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
      className={`grow p-4 rounded-2xl border border-surface-border ${className}`}
    >
      <p className="w-fit mx-auto lg:text-2xl font-bold">Total Courses Progress</p>
      <p className="w-fit mx-auto my-2 lg:text-2xl font-bold">{percentage}%</p>
      <ProgressBar progress={percentage} />
    </div>
  );
};

export default TotalProgress;
