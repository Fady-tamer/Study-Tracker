import { useContext, useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";

// icons
import {
  BiCalendar,
  BiCalendarCheck,
  BiChevronLeft,
  BiChevronRight,
  BiPlus,
  BiTrash,
  BiCheck,
  BiTimeFive,
  BiFilter,
  BiGridAlt,
  BiListUl,
} from "react-icons/bi";
import {
  IoCalendarOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { MdCheckCircleOutline } from "react-icons/md";

// context
import { mainStore } from "../../context/MainContext";

// database
import { supabase } from "../../supabaseClient";

// modals
import { AddAssignment } from "../../components";

// utils
import { toDateKey, formatTimeOnly } from "../../utils";

// Helper: Determine status of an assignment
const getAssignmentStatus = (item, todayKey) => {
  if (item.isDone) return "completed";
  if (!item.deadline) return "pending";
  const due = new Date(item.deadline);
  const now = new Date();
  if (due < now) return "overdue";
  if (toDateKey(due) === todayKey) return "today";
  return "upcoming";
};

const CalendarPage = () => {
  const {
    assignments,
    saveAssignments,
    fetchAssignments,
    courses,
    setShowAddAssignment,
    setAddAssignmentInitialDate,
  } = useContext(mainStore);

  // Calendar view state
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'agenda'
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'pending' | 'completed' | 'overdue'

  const todayKey = toDateKey(new Date());

  // Refetch assignments on mount to ensure fresh state
  useEffect(() => {
    if (fetchAssignments) {
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quick navigation helpers
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return (assignments || []).filter((item) => {
      // Course filter
      if (filterCourse !== "all") {
        const itemCourseId = item.course_id || item.courses?.id;
        if (itemCourseId !== filterCourse) return false;
      }
      // Status filter
      if (filterStatus === "completed" && !item.isDone) return false;
      if (filterStatus === "pending" && item.isDone) return false;
      if (filterStatus === "overdue") {
        const status = getAssignmentStatus(item, todayKey);
        if (status !== "overdue") return false;
      }
      return true;
    });
  }, [assignments, filterCourse, filterStatus, todayKey]);

  // Map assignments by DateKey (YYYY-MM-DD)
  const assignmentsByDate = useMemo(() => {
    const map = new Map();
    filteredAssignments.forEach((item) => {
      if (!item.deadline) return;
      const key = toDateKey(item.deadline);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });
    return map;
  }, [filteredAssignments]);

  // Compute stats for current displayed month
  const monthStats = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthItems = (assignments || []).filter((item) => {
      if (!item.deadline) return false;
      const d = new Date(item.deadline);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const total = monthItems.length;
    const completed = monthItems.filter((i) => i.isDone).length;
    const overdue = monthItems.filter(
      (i) => !i.isDone && new Date(i.deadline) < new Date()
    ).length;
    const pending = total - completed;

    return { total, completed, overdue, pending };
  }, [assignments, currentMonth]);

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Preceding padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const key = toDateKey(prevDate);
      days.push({
        date: prevDate,
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: key === todayKey,
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
        isToday: key === todayKey,
        assignments: assignmentsByDate.get(key) || [],
      });
    }

    // Succeeding padding days to complete grid (multiples of 7)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const key = toDateKey(nextDate);
      days.push({
        date: nextDate,
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: key === todayKey,
        assignments: assignmentsByDate.get(key) || [],
      });
    }

    return days;
  }, [currentMonth, assignmentsByDate, todayKey]);

  // Selected date items
  const selectedDateAssignments = useMemo(() => {
    return assignmentsByDate.get(selectedDate) || [];
  }, [assignmentsByDate, selectedDate]);

  // Toggle completion of an assignment
  const handleToggleDone = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;

    // Optimistic UI update
    const updatedAssignments = (assignments || []).map((item) =>
      item.id === id ? { ...item, isDone: updatedStatus } : item
    );
    saveAssignments(updatedAssignments);

    toast.success(
      updatedStatus ? "Assignment completed! 🎉" : "Marked as pending"
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

  // Delete assignment
  const handleDeleteAssignment = async (id) => {
    const prev = [...(assignments || [])];
    const filtered = (assignments || []).filter((item) => item.id !== id);
    saveAssignments(filtered);

    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete assignment");
      saveAssignments(prev);
    } else {
      toast.success("Assignment removed");
    }
  };

  // Open Add modal with selected date prefilled
  const handleOpenAddForSelectedDate = () => {
    if (setAddAssignmentInitialDate) {
      // Default to 12:00 PM on the selected date
      setAddAssignmentInitialDate(`${selectedDate}T12:00`);
    }
    setShowAddAssignment(true);
  };

  // Format month and year label
  const monthYearLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Selected date label
  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return "Select a date";
    const parts = selectedDate.split("-");
    if (parts.length !== 3) return selectedDate;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
                <IoCalendarOutline className="text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
                Academic Calendar
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-500/20">
                <IoSparklesOutline className="text-xs" /> Deadlines Synced
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
              Synchronized view of course assignments, project milestones, and upcoming exams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Switcher: Grid vs Agenda */}
            <div className="flex items-center rounded-xl border border-surface-border bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-Typography-primary shadow-xs"
                    : "text-Typography-secondary hover:text-Typography-primary"
                }`}
                title="Month Grid View"
              >
                <BiGridAlt className="text-sm" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("agenda")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "agenda"
                    ? "bg-white text-Typography-primary shadow-xs"
                    : "text-Typography-secondary hover:text-Typography-primary"
                }`}
                title="Agenda Timeline View"
              >
                <BiListUl className="text-sm" />
                <span className="hidden sm:inline">Agenda</span>
              </button>
            </div>

            {/* Quick Add Assignment */}
            <button
              type="button"
              onClick={handleOpenAddForSelectedDate}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 cursor-pointer"
            >
              <BiPlus className="text-lg" />
              <span>Add Assignment</span>
            </button>
          </div>
        </div>

        {/* Month Navigation & Filters Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Month Stepper */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-xl border border-surface-border bg-slate-50 p-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-Typography-secondary hover:bg-white hover:text-Typography-primary hover:shadow-xs transition-all cursor-pointer"
                title="Previous Month"
              >
                <BiChevronLeft className="text-xl" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-Typography-secondary hover:bg-white hover:text-Typography-primary hover:shadow-xs transition-all cursor-pointer"
                title="Next Month"
              >
                <BiChevronRight className="text-xl" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoToday}
              className="rounded-xl border border-surface-border bg-white px-3 py-1.5 text-xs font-bold text-Typography-secondary hover:bg-slate-50 hover:text-Typography-primary transition-all cursor-pointer"
            >
              Today
            </button>

            <h2 className="text-base sm:text-lg font-bold text-Typography-primary font-['Outfit'] min-w-[160px]">
              {monthYearLabel}
            </h2>
          </div>

          {/* Filters: Course & Status */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-Typography-muted">
              <BiFilter className="text-base" />
              <span className="font-semibold hidden sm:inline">Filter:</span>
            </div>

            {/* Course Selector */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="rounded-xl border border-surface-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-Typography-primary focus:border-brand-primary focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {(courses || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.topic_name}
                </option>
              ))}
            </select>

            {/* Status Selector */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-surface-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-Typography-primary focus:border-brand-primary focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="completed">Completed Only</option>
              <option value="overdue">Overdue Only</option>
            </select>
          </div>
        </div>

        {/* Monthly Summary Statistics Pills */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 pt-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="text-[11px] font-semibold text-Typography-muted block">
              Total In {currentMonth.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-lg font-bold text-Typography-primary font-['Outfit']">
              {monthStats.total} Deliverables
            </span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <span className="text-[11px] font-semibold text-emerald-700 block">
              Completed
            </span>
            <span className="text-lg font-bold text-emerald-800 font-['Outfit']">
              {monthStats.completed} Finished
            </span>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
            <span className="text-[11px] font-semibold text-indigo-700 block">
              Upcoming
            </span>
            <span className="text-lg font-bold text-indigo-800 font-['Outfit']">
              {monthStats.pending} Pending
            </span>
          </div>

          <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
            <span className="text-[11px] font-semibold text-rose-700 block">
              Overdue
            </span>
            <span className="text-lg font-bold text-rose-800 font-['Outfit']">
              {monthStats.overdue} Tasks
            </span>
          </div>
        </div>
      </div>

      {/* Main Calendar Body: Responsive Grid + Day Agenda Drawer */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Calendar Month Grid (8 columns on lg, full width on smaller) */}
          <div className="lg:col-span-8 rounded-2xl border border-surface-border bg-surface-panel p-4 sm:p-5 shadow-xs">
            {/* Weekday Labels Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
              {weekDays.map((day, idx) => (
                <div
                  key={day}
                  className={`py-2 text-[11px] font-bold uppercase tracking-wider ${
                    idx === 0 || idx === 6
                      ? "text-rose-500/80"
                      : "text-Typography-muted"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 auto-rows-fr">
              {calendarDays.map((cell) => {
                const isSelected = cell.dateKey === selectedDate;
                const hasAssignments = cell.assignments.length > 0;
                const completedInDay = cell.assignments.filter((a) => a.isDone).length;
                const overdueInDay = cell.assignments.filter(
                  (a) => !a.isDone && new Date(a.deadline) < new Date()
                ).length;
                const hasPending = cell.assignments.some((a) => !a.isDone);

                return (
                  <div
                    key={cell.dateKey}
                    onClick={() => {
                      setSelectedDate(cell.dateKey);
                      if (!cell.isCurrentMonth) {
                        setCurrentMonth(
                          new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
                        );
                      }
                    }}
                    className={`group relative min-h-[75px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-brand-primary bg-indigo-50/30 ring-2 ring-brand-primary/20 shadow-xs"
                        : cell.isCurrentMonth
                        ? "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        : "border-transparent bg-slate-50/40 text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {/* Day number header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-transform group-hover:scale-105 ${
                          cell.isToday
                            ? "bg-brand-primary text-white shadow-xs"
                            : isSelected
                            ? "bg-indigo-100 text-brand-primary"
                            : cell.isCurrentMonth
                            ? "text-Typography-primary"
                            : "text-slate-400"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {/* Small notification dot if deliverables exist */}
                      {hasAssignments && (
                        <span className="flex items-center gap-0.5">
                          {overdueInDay > 0 && (
                            <span
                              className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
                              title={`${overdueInDay} Overdue`}
                            />
                          )}
                          {hasPending && overdueInDay === 0 && (
                            <span
                              className="h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white"
                              title="Pending deliverables"
                            />
                          )}
                          {!hasPending && completedInDay > 0 && (
                            <span
                              className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"
                              title="All completed"
                            />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Assignment Badges / Chips */}
                    <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                      {cell.assignments.slice(0, 2).map((item) => {
                        const status = getAssignmentStatus(item, todayKey);
                        return (
                          <div
                            key={item.id}
                            className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight transition-colors ${
                              status === "completed"
                                ? "bg-emerald-50 text-emerald-700 line-through opacity-75"
                                : status === "overdue"
                                ? "bg-rose-50 text-rose-700 border-l-2 border-rose-500"
                                : status === "today"
                                ? "bg-amber-50 text-amber-800 border-l-2 border-amber-500"
                                : "bg-indigo-50 text-indigo-700 border-l-2 border-brand-primary"
                            }`}
                            title={`${item.assignment_name} (${formatTimeOnly(item.deadline)})`}
                          >
                            <span className="block truncate font-medium">
                              {item.assignment_name}
                            </span>
                          </div>
                        );
                      })}

                      {cell.assignments.length > 2 && (
                        <span className="text-[10px] font-bold text-Typography-muted hover:text-brand-primary">
                          +{cell.assignments.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Inspector & Agenda Panel (4 columns on lg) */}
          <div className="lg:col-span-4 rounded-2xl border border-surface-border bg-surface-panel p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-Typography-muted block">
                  Schedule Agenda
                </span>
                <h3 className="text-base font-bold text-Typography-primary font-['Outfit']">
                  {selectedDateLabel}
                </h3>
              </div>

              {selectedDate === todayKey && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
                  Today
                </span>
              )}
            </div>

            {/* Assignments on Selected Date */}
            <div className="mt-4 flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {selectedDateAssignments.length > 0 ? (
                selectedDateAssignments.map((item) => {
                  const status = getAssignmentStatus(item, todayKey);

                  return (
                    <div
                      key={item.id}
                      className={`group rounded-xl border p-3.5 transition-all ${
                        item.isDone
                          ? "border-emerald-100 bg-emerald-50/20"
                          : status === "overdue"
                          ? "border-rose-200 bg-rose-50/30"
                          : status === "today"
                          ? "border-amber-200 bg-amber-50/30"
                          : "border-surface-border bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          {/* Done Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleDone(item.id, item.isDone)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${
                              item.isDone
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                                : "border-slate-300 bg-white hover:border-emerald-500 text-transparent"
                            }`}
                            title={
                              item.isDone
                                ? "Mark as pending"
                                : "Mark as completed"
                            }
                          >
                            <BiCheck className="text-base font-bold" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-sm font-semibold block capitalize ${
                                item.isDone
                                  ? "line-through text-Typography-muted"
                                  : "text-Typography-primary"
                              }`}
                            >
                              {item.assignment_name}
                            </span>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                {item.courses?.topic_name || "General Course"}
                              </span>

                              <span className="flex items-center gap-1 text-[11px] text-Typography-muted">
                                <BiTimeFive className="text-xs" />
                                {formatTimeOnly(item.deadline)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(item.id)}
                          className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                          title="Delete assignment"
                        >
                          <BiTrash className="text-base" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <BiCalendarCheck className="text-2xl" />
                  </div>
                  <h4 className="text-xs font-bold text-Typography-primary">
                    No Deliverables Due
                  </h4>
                  <p className="mt-1 text-[11px] text-Typography-secondary">
                    You have no scheduled tasks or deadlines for this day.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Add for Selected Day */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleOpenAddForSelectedDate}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-xs font-bold text-Typography-primary hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <BiPlus className="text-base text-brand-primary" />
                <span>Schedule Task for this Day</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda / Timeline View */
        <div className="rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-Typography-primary font-['Outfit']">
              Chronological Agenda
            </h3>
            <p className="text-xs text-Typography-muted">
              All deliverables organized chronologically by deadline date
            </p>
          </div>

          {filteredAssignments.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-100">
              {filteredAssignments.map((item) => {
                const status = getAssignmentStatus(item, todayKey);
                const itemDateKey = toDateKey(item.deadline);
                const isItemToday = itemDateKey === todayKey;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-slate-50/60 px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleDone(item.id, item.isDone)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          item.isDone
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 bg-white hover:border-emerald-500 text-transparent"
                        }`}
                        title={
                          item.isDone
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >
                        <BiCheck className="text-base font-bold" />
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`text-sm font-semibold capitalize block truncate ${
                            item.isDone
                              ? "line-through text-Typography-muted"
                              : "text-Typography-primary"
                          }`}
                        >
                          {item.assignment_name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-medium text-brand-primary">
                            {item.courses?.topic_name || "General Course"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`font-semibold ${
                            status === "overdue"
                              ? "text-rose-600"
                              : status === "today"
                              ? "text-amber-600"
                              : "text-Typography-secondary"
                          }`}
                        >
                          <BiCalendar className="inline mr-1 text-sm" />
                          {item.deadline
                            ? new Date(item.deadline).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "No deadline"}
                        </span>

                        {isItemToday && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-500/20">
                            Today
                          </span>
                        )}
                        {status === "overdue" && (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-500/20">
                            Overdue
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAssignment(item.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete assignment"
                      >
                        <BiTrash className="text-base" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-brand-primary">
                <MdCheckCircleOutline className="text-2xl" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-Typography-primary">
                No Tasks Match Your Filter
              </h4>
              <p className="mt-1 text-xs text-Typography-secondary max-w-sm">
                Try switching the course or status filters, or schedule a new assignment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Global AddAssignment Modal */}
      <AddAssignment />
    </div>
  );
};

export default CalendarPage;
