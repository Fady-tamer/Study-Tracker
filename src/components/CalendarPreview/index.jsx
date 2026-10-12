import { useContext, useMemo, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

// icons
import {
  IoCalendarOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import {
  BiCheck,
  BiTimeFive,
  BiPlus,
} from "react-icons/bi";

// context
import { mainStore } from "../../context/MainContext";

// database
import { supabase } from "../../supabaseClient";

// utils
import { toDateKey, formatTimeOnly } from "../../utils";

const CalendarPreview = ({ className = "" }) => {
  const {
    assignments,
    saveAssignments,
    fetchAssignments,
    setShowAddAssignment,
    setAddAssignmentInitialDate,
  } = useContext(mainStore);

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));

  const todayKey = toDateKey(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  // Map assignments by DateKey
  const assignmentsByDate = useMemo(() => {
    const map = new Map();
    (assignments || []).forEach((item) => {
      if (!item.deadline) return;
      const key = toDateKey(item.deadline);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });
    return map;
  }, [assignments]);

  // Generate calendar grid days (Sun-Sat)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Padding from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const key = toDateKey(prevDate);
      days.push({
        date: prevDate,
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        assignments: assignmentsByDate.get(key) || [],
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const thisDate = new Date(year, month, i);
      const key = toDateKey(thisDate);
      days.push({
        date: thisDate,
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: true,
        assignments: assignmentsByDate.get(key) || [],
      });
    }

    // Padding for next month
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const key = toDateKey(nextDate);
      days.push({
        date: nextDate,
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: false,
        assignments: assignmentsByDate.get(key) || [],
      });
    }

    return days;
  }, [currentMonth, assignmentsByDate]);

  // Selected date assignments
  const selectedDateAssignments = useMemo(() => {
    return assignmentsByDate.get(selectedDate) || [];
  }, [assignmentsByDate, selectedDate]);

  // Selected date label
  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return "Select a date";
    if (selectedDate === todayKey) return "Today's Schedule";
    const parts = selectedDate.split("-");
    if (parts.length !== 3) return selectedDate;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [selectedDate, todayKey]);

  // Direct completion toggle
  const handleToggleDone = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    const updated = (assignments || []).map((item) =>
      item.id === id ? { ...item, isDone: updatedStatus } : item,
    );
    saveAssignments(updated);

    toast.success(
      updatedStatus ? "Assignment completed! 🎉" : "Marked as pending",
    );

    const { error } = await supabase
      .from("assignments")
      .update({ isDone: updatedStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      if (fetchAssignments) fetchAssignments();
    }
  };

  const handleOpenAddForDate = () => {
    if (setAddAssignmentInitialDate) {
      setAddAssignmentInitialDate(`${selectedDate}T12:00`);
    }
    setShowAddAssignment(true);
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const weekHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
      className={`relative overflow-hidden flex min-w-0 flex-1 flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white via-white to-indigo-50/20 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Decorative ambient background accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-indigo-500/5 blur-2xl" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
              <IoCalendarOutline className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-Typography-primary font-['Outfit']">
                Calendar Preview
              </h3>
              <p className="text-xs text-Typography-muted">
                Academic deadlines sync
              </p>
            </div>
          </div>

          <Link
            to="/calendar"
            className="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors"
          >
            Full View →
          </Link>
        </div>

        {/* Mini Calendar Month Bar */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-Typography-primary">
              {monthLabel}
            </span>
            {selectedDate === todayKey && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
                Today
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleGoToday}
              className="rounded-lg px-2 py-1 text-[10px] font-bold text-Typography-secondary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-Typography-primary transition-colors cursor-pointer"
              title="Previous month"
            >
              <IoChevronBack className="text-xs" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-Typography-primary transition-colors cursor-pointer"
              title="Next month"
            >
              <IoChevronForward className="text-xs" />
            </button>
          </div>
        </div>

        {/* Mini Grid Header */}
        <div className="grid grid-cols-7 text-center pt-2 pb-1">
          {weekHeaders.map((day, i) => (
            <span
              key={i}
              className="text-[10px] font-bold text-Typography-muted uppercase"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Mini Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((cell) => {
            const isSelected = cell.dateKey === selectedDate;
            const isToday = cell.dateKey === todayKey;
            const hasTasks = cell.assignments.length > 0;
            const hasOverdue = cell.assignments.some(
              (a) => !a.isDone && new Date(a.deadline) < new Date(),
            );
            const hasPending = cell.assignments.some((a) => !a.isDone);
            const allDone = hasTasks && cell.assignments.every((a) => a.isDone);

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDate(cell.dateKey)}
                className={`group relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-primary text-white font-bold shadow-xs scale-105"
                    : isToday
                    ? "bg-indigo-50 text-brand-primary font-bold ring-1 ring-brand-primary/30"
                    : cell.isCurrentMonth
                    ? "text-Typography-primary hover:bg-slate-100"
                    : "text-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-[11px] leading-none">
                  {cell.dayNumber}
                </span>

                {/* Dot status indicator */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {hasTasks && (
                    <span
                      className={`h-1 w-1 rounded-full ${
                        isSelected
                          ? "bg-white"
                          : hasOverdue
                          ? "bg-rose-500"
                          : hasPending
                          ? "bg-brand-primary"
                          : allDone
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Date Agenda Mini-Box */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-Typography-primary block">
              {selectedDateLabel}
            </span>
            <button
              type="button"
              onClick={handleOpenAddForDate}
              className="flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
            >
              <BiPlus className="text-xs" />
              <span>Add</span>
            </button>
          </div>

          {selectedDateAssignments.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
              {selectedDateAssignments.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 border border-slate-100 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleDone(task.id, task.isDone)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
                        task.isDone
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 bg-white hover:border-emerald-500 text-transparent"
                      }`}
                      title={task.isDone ? "Pending" : "Complete"}
                    >
                      <BiCheck className="text-xs font-bold" />
                    </button>
                    <span
                      className={`truncate font-medium capitalize ${
                        task.isDone
                          ? "line-through text-Typography-muted"
                          : "text-Typography-primary"
                      }`}
                    >
                      {task.assignment_name}
                    </span>
                  </div>

                  <span className="text-[10px] text-Typography-muted shrink-0 flex items-center gap-0.5">
                    <BiTimeFive className="text-[10px]" />
                    {formatTimeOnly(task.deadline)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-[11px] text-Typography-muted">
              No assignments scheduled for this day
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs">
        <span className="text-Typography-muted text-[11px]">
          {(assignments || []).filter((a) => !a.isDone).length} Total pending
        </span>
        <Link
          to="/calendar"
          className="font-semibold text-brand-primary hover:text-brand-dark transition-colors"
        >
          View all deadlines →
        </Link>
      </div>
    </div>
  );
};

export default CalendarPreview;
