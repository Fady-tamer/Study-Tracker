import { useEffect, useState } from "react";

const modes = [
  { id: 1, name: "Focus", time: 1500 },
  { id: 2, name: "Short Break", time: 300 },
  { id: 3, name: "Long Break", time: 900 },
];

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Focus");

  const changeMode = (modeName) => {
    const selected = modes.find((mode) => mode.name === modeName);
    setSelectedMode(modeName);
    setTimeLeft(selected.time);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    const selected = modes.find((mode) => mode.name === selectedMode);
    setTimeLeft(selected.time);
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft == 0) {
      setIsActive(false);
    }
  }, [isActive, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="max-w-full w-fit p-20 flex flex-col items-center rounded-2xl bg-surface-bg">
      {/* 1. Phase Switcher (Tabs) */}
      <div className="flex space-x-1 bg-surface-bg p-1.5 rounded-full mb-10 border border-surface-border">
        {modes.map((mode) => {
          return selectedMode == mode.name ? (
            <button
              key={mode.id}
              onClick={() => {
                changeMode(mode.name);
              }}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-surface-panel text-text-primary shadow-sm transition-all cursor-pointer"
            >
              {mode.name}
            </button>
          ) : (
            <button
              key={mode.id}
              onClick={() => {
                changeMode(mode.name);
              }}
              className="px-5 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
              {mode.name}
            </button>
          );
        })}
      </div>

      {/* 2. Timer Display */}
      <div className="text-9xl font-extrabold text-text-primary tracking-tighter tabular-nums mb-10 drop-shadow-md">
        {minutes + ":" + seconds}
      </div>

      {/* 3. Controls */}
      <div className="flex items-center space-x-4">
        {/* Main Action Button */}
        <button
          onClick={() => {
            toggleTimer();
          }}
          className="px-10 py-4 rounded-2xl font-bold text-lg bg-phase-focus text-white hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          {isActive ? "STOP" : "START"}
        </button>

        {/* Secondary Action (Reset) */}
        <button
          onClick={() => {
            resetTimer();
          }}
          className="px-10 py-4 rounded-2xl font-bold text-lg bg-surface-panel text-white hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Reset Timer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
