import { useParams } from "react-router";

const CourseDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="grow flex">
      <div className="grow p-4 rounded-2xl rounded-t-none rounded-l-none text-Typography-primary border border-surface-border bg-surface-panel">
        CourseDetails:{id}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
