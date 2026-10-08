// components
import { useContext, useState } from "react";
import CoursesTable from "../../components/CoursesTable";
import AddCourse from "../../components/models/AddCourse";
import { mainStore } from "../../context/MainContext";

const CoursesPage = () => {
  const { showAddCourse, setShowAddCourse } = useContext(mainStore);

  return (
    <div className="grow flex">
      <div className="grow p-4 flex flex-col gap-4 rounded-2xl rounded-t-none rounded-l-none text-Typography-primary border border-surface-border bg-surface-panel">
        <div className="py-4 pt-0 flex justify-between items-center">
          <p className="font-bold">My Courses</p>
          <button
            onClick={() => {
              setShowAddCourse(!showAddCourse);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Add Course
          </button>
        </div>
        <CoursesTable />
        <AddCourse />
      </div>
    </div>
  );
};

export default CoursesPage;
