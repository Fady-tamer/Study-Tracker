const ProgressBar = ({ progress }) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <div className="w-15 xl:w-40 h-3 bg-surface-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="min-w-8 text-left">{progress}%</p>
    </div>
  );
};

export default ProgressBar;
