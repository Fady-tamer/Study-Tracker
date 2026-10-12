import { useContext } from "react";
import { Link } from "react-router";
import { BiPlus } from "react-icons/bi";
import { MdOutlineAssignment } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";

// components
import AssignmentsTable from "./components/AssignmentsTable";
import { AddAssignment } from "../../components";

// context
import { mainStore } from "../../context/MainContext";

const AssignmentPage = () => {
  const { setShowAddAssignment, assignments } = useContext(mainStore);

  const pendingCount =
    assignments?.filter((a) => !a.isDone)?.length || 0;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <MdOutlineAssignment className="text-lg" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-Typography-primary font-['Outfit']">
                Assignments & Tasks
              </h1>
              {pendingCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600 ring-1 ring-rose-500/20">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-Typography-secondary">
              Track assignment deliverables, target deadlines, and completion statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/calendar"
              className="flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-xl border border-surface-border bg-slate-50/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-Typography-primary hover:bg-white hover:border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <IoCalendarOutline className="text-base text-brand-primary" />
              <span>Calendar View</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowAddAssignment(true)}
              className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 sm:w-auto cursor-pointer"
            >
              <BiPlus className="text-lg" />
              <span>Add Assignment</span>
            </button>
          </div>
        </div>

        <AssignmentsTable />
      </div>

      <AddAssignment />
    </div>
  );
};

export default AssignmentPage;
