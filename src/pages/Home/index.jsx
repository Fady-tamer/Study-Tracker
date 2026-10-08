import CoursesTable from "../../components/CoursesTable";
import AddCourse from "../../components/models/AddCourse";
import TotalProgress from "../../components/TotalProgress";

const Home = () => {
  return (
    <div className="grow flex">
      <div className="grow grid md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4 p-4 rounded-2xl rounded-t-none rounded-l-none text-Typography-primary border border-surface-border bg-surface-panel">
        <TotalProgress className={`col-span-1`} />
        <CoursesTable className={`col-span-2 max-h-65`} />
        <AddCourse />
      </div>
    </div>
  );
};

export default Home;
