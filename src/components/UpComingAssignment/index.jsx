import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";

// icons
import { MdOutlineAssignmentLate, MdCheckCircleOutline } from "react-icons/md";
import { BiCalendarCheck, BiTimeFive, BiErrorCircle } from "react-icons/bi";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

// utils
import { formatDeadline } from "../../utils";

const UpComingAssignment = () => {
  const { assignments } = useContext(mainStore);
  const [fetchedNext, setFetchedNext] = useState(null);
  const [loading, setLoading] = useState(true);

  // If assignments exists in global context, derive directly from it for real-time reactivity
  const pendingFromContext = (assignments || [])
    .filter((a) => !a.isDone && a.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const hasContextData = assignments !== undefined && assignments !== null;
  const nextAssignment = hasContextData
    ? pendingFromContext[0] || null
    : fetchedNext;

  useEffect(() => {
    let isMounted = true;
    const fetchNextAssignment = async () => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .select(
            `
              id,
              assignment_name,
              deadline,
              isDone,
              courses (
                topic_name
              )
            `,
          )
          .eq("isDone", false)
          .not("deadline", "is", null)
          .order("deadline", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (isMounted) setFetchedNext(data);
      } catch (err) {
        console.error("Error fetching assignment:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!hasContextData || assignments.length === 0) {
      fetchNextAssignment();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [assignments, hasContextData]);

  const getDaysRemainingInfo = (time) => {
    if (!time) return null;
    const diff = new Date(time) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) {
      return {
        text: `${Math.abs(days)}d Overdue`,
        badgeClass: "bg-rose-100 text-rose-700 ring-rose-500/30",
        isOverdue: true,
      };
    }
    if (days === 0) {
      return {
        text: "Due Today",
        badgeClass: "bg-amber-100 text-amber-800 ring-amber-500/30",
        isToday: true,
      };
    }
    if (days === 1) {
      return {
        text: "Due Tomorrow",
        badgeClass: "bg-amber-50 text-amber-700 ring-amber-500/20",
        isSoon: true,
      };
    }
    return {
      text: `In ${days} days`,
      badgeClass: "bg-indigo-50 text-indigo-700 ring-indigo-500/20",
    };
  };

  if (loading && !hasContextData) {
    return (
      <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-surface-border bg-surface-panel p-6 shadow-sm">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!nextAssignment) {
    return (
      <div className="relative overflow-hidden flex min-w-0 flex-1 flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white via-white to-slate-50/60 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MdCheckCircleOutline className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-Typography-primary">
                Upcoming Deadline
              </h3>
              <p className="text-xs text-Typography-muted">Next task on schedule</p>
            </div>
          </div>
        </div>

        <div className="my-6 text-center">
          <p className="text-base font-bold text-Typography-primary">
            All Caught Up! 🎉
          </p>
          <p className="mt-1 text-xs text-Typography-secondary">
            No upcoming assignment deadlines scheduled.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3 text-right">
          <Link
            to="/assignments"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            Manage assignments →
          </Link>
        </div>
      </div>
    );
  }

  const remainingInfo = getDaysRemainingInfo(nextAssignment.deadline);

  return (
    <div className="relative overflow-hidden flex min-w-0 flex-1 flex-col justify-between rounded-2xl border border-surface-border bg-gradient-to-br from-white via-white to-rose-50/20 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
      {/* Decorative ambient background accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-rose-500/5 blur-2xl" />

      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                remainingInfo?.isOverdue
                  ? "bg-rose-100 text-rose-600"
                  : "bg-rose-50 text-rose-500"
              }`}
            >
              {remainingInfo?.isOverdue ? (
                <BiErrorCircle className="text-xl" />
              ) : (
                <MdOutlineAssignmentLate className="text-xl" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-Typography-primary">
                Next Deadline
              </h3>
              <p className="text-xs text-Typography-muted">
                {remainingInfo?.isOverdue ? "Overdue assignment requires attention" : "Prioritize your study session"}
              </p>
            </div>
          </div>

          {remainingInfo && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${remainingInfo.badgeClass}`}
            >
              <BiTimeFive className="text-xs" /> {remainingInfo.text}
            </span>
          )}
        </div>

        <div className="my-5">
          <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
            {nextAssignment.courses?.topic_name || "General Course"}
          </span>
          <h4 className="mt-2 text-xl font-bold tracking-tight text-Typography-primary truncate capitalize font-['Outfit']">
            {nextAssignment.assignment_name}
          </h4>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
            <BiCalendarCheck className="text-base" />
            <span>Due: {formatDeadline(nextAssignment.deadline)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
        <Link
          to="/calendar"
          className="font-medium text-Typography-secondary hover:text-brand-primary transition-colors flex items-center gap-1"
        >
          <BiCalendarCheck className="text-sm" />
          <span>Calendar</span>
        </Link>
        <Link
          to="/assignments"
          className="font-semibold text-brand-primary hover:text-brand-dark transition-colors"
        >
          View all assignments →
        </Link>
      </div>
    </div>
  );
};

export default UpComingAssignment;
