const ProgressBar = ({ progress = 0, height = "h-3", color = "from-emerald-500 to-teal-400" }) => {
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner`}>
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
