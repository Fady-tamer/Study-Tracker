import Timer from "../components/Timer";

const Home = () => {
  return (
    <div className="grow mx-4 flex">
      <div className="grow max-w-470 mx-auto p-4 rounded-2xl text-Typography-primary border border-surface-border bg-surface-panel">
        <Timer />
      </div>
    </div>
  );
};

export default Home;
