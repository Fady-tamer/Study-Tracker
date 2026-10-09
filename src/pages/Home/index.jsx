import CoursesTable from "../../components/CoursesTable";
import AddCourse from "../../components/models/AddCourse";
import TotalProgress from "../../components/TotalProgress";

const Home = () => {
  return (
    <div className="grow flex">
      <div className="grow p-4 rounded-2xl rounded-t-none text-Typography-primary border border-surface-border bg-surface-panel">
        {/* mobile */}
        <div className="md:hidden flex flex-col gap-4">
          <TotalProgress />
          <CoursesTable />
        </div>

        {/* tablet */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          <div className="flex gap-4">
            <TotalProgress />
            <TotalProgress />
          </div>
          <CoursesTable />
        </div>

        {/* laptop */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="flex gap-4">
            <TotalProgress />
            <TotalProgress />
            <TotalProgress />
          </div>
          <CoursesTable />
        </div>

        <AddCourse />
      </div>
    </div>
  );
};

export default Home;
