const ProgressBar = ({ progress }) => {
  return (
    <div
      className={`w-[80%] h-5 mx-auto bg-surface-bg rounded-full border border-surface-border overflow-hidden`}
    >
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
