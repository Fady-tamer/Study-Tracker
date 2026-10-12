const UserIcon = ({
  onClickFN,
  userName = "User",
  width = "w-10",
  height,
  hight,
  textS = "text-base",
  CPointer = false,
}) => {
  const finalHeight = height || hight || "h-10";
  const initial = userName ? String(userName).trim().charAt(0) : "U";

  return (
    <div
      onClick={onClickFN}
      className={`${width} ${finalHeight} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-indigo-400 text-white shadow-sm ring-1 ring-black/5 select-none transition-all ${
        CPointer ? "cursor-pointer hover:shadow-md hover:scale-105 active:scale-95" : ""
      }`}
    >
      <span className={`capitalize ${textS} font-bold leading-none tracking-tight`}>
        {initial}
      </span>
    </div>
  );
};

export default UserIcon;
