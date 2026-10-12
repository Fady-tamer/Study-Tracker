import { useEffect, useState } from "react";
import { BiPlay, BiPause, BiReset } from "react-icons/bi";

const modes = [
  { id: 1, name: "Focus", time: 1500, label: "Deep Focus", gradient: "from-indigo-600 via-indigo-700 to-indigo-900" },
  { id: 2, name: "Short Break", time: 300, label: "Short Break", gradient: "from-emerald-600 via-teal-700 to-emerald-900" },
  { id: 3, name: "Long Break", time: 900, label: "Long Break", gradient: "from-purple-600 via-indigo-800 to-purple-950" },
];

const Timer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Focus");

  const currentModeObj = modes.find((m) => m.name === selectedMode) || modes[0];

  const changeMode = (modeName) => {
    const selected = modes.find((m) => m.name === modeName);
    if (!selected) return;
    setSelectedMode(modeName);
    setTimeLeft(selected.time);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    const selected = modes.find((m) => m.name === selectedMode);
    if (selected) setTimeLeft(selected.time);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);

      // Notify parent with minutes completed
      if (selectedMode === "Focus" && onComplete) {
        const fullSeconds =
          modes.find((m) => m.name === "Focus")?.time || 1500;
        const minutesCompleted = Math.round(fullSeconds / 60);
        onComplete(minutesCompleted);
      }
    }
  }, [timeLeft, isActive, selectedMode, onComplete]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div
      className={`relative overflow-hidden w-full max-w-xl mx-auto p-6 sm:p-10 flex flex-col items-center rounded-3xl bg-gradient-to-br ${currentModeObj.gradient} shadow-xl text-white transition-all duration-500`}
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      {/* Mode Switcher */}
      <div className="relative z-10 flex flex-wrap justify-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-full mb-8 border border-white/15">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.name;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => changeMode(mode.name)}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-white text-slate-900 shadow-md scale-102"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {mode.name}
            </button>
          );
        })}
      </div>

      {/* Timer Display */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter tabular-nums select-none font-['Outfit'] drop-shadow-sm">
          {`${minutes}:${seconds}`}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isActive ? "bg-emerald-400 animate-pulse" : "bg-white/40"
            }`}
          />
          <span className="text-xs uppercase tracking-widest font-bold text-white/75">
            {isActive ? "Timer Running" : "Paused"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-8 flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggleTimer}
          className="flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base bg-white text-slate-900 hover:bg-slate-50 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          {isActive ? (
            <>
              <BiPause className="text-xl" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <BiPlay className="text-xl" />
              <span>START</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="flex items-center gap-1.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all shadow-md cursor-pointer border border-white/20 backdrop-blur-xs"
          title="Reset Timer"
        >
          <BiReset className="text-xl" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Timer;
