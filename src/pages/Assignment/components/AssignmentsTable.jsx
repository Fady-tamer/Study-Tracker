import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// icons
import { BiCheck, BiTrash, BiPlus, BiCalendar } from "react-icons/bi";
import { MdOutlineAssignmentLate } from "react-icons/md";

// database
import { supabase } from "../../../supabaseClient";

// context
import { mainStore } from "../../../context/MainContext";

// utils
import { formatDeadline, getDeadlineStatus } from "../../../utils";

const AssignmentsTable = ({ className = "" }) => {
  const {
    assignments,
    saveAssignments,
    setShowAddAssignment,
  } = useContext(mainStore);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'completed'

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
        id,
        assignment_name,
        deadline,
        isDone,
        courses (
          id,
          topic_name
        )`
      )
      .order("deadline", { ascending: true });

    if (!error && data) {
      saveAssignments(data);
    }
    setLoading(false);
  };

  // Toggle completion status
  const handleToggleDone = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;

    // Optimistic UI update
    const updatedAssignments = assignments.map((item) =>
      item.id === id ? { ...item, isDone: updatedStatus } : item
    );
    saveAssignments(updatedAssignments);

    toast.success(
      updatedStatus ? "Assignment completed! 🎉" : "Marked as pending",
    );

    const { error } = await supabase
      .from("assignments")
      .update({ isDone: updatedStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update assignment status");
      fetchAssignments();
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id) => {
    const previousAssignments = [...(assignments || [])];
    const filtered = assignments.filter((item) => item.id !== id);
    saveAssignments(filtered);

    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete assignment");
      saveAssignments(previousAssignments);
      fetchAssignments();
    } else {
      toast.success("Assignment removed");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = (assignments || []).filter((item) => {
    if (filter === "pending") return !item.isDone;
    if (filter === "completed") return item.isDone;
    return true;
  });

  const totalCount = assignments?.length || 0;
  const pendingCount = assignments?.filter((a) => !a.isDone)?.length || 0;
  const completedCount = assignments?.filter((a) => a.isDone)?.length || 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "text-Typography-secondary hover:bg-slate-100"
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filter === "pending"
              ? "bg-brand-primary text-white"
              : "text-Typography-secondary hover:bg-slate-100"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filter === "completed"
              ? "bg-emerald-600 text-white"
              : "text-Typography-secondary hover:bg-slate-100"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="coursesTable overflow-x-auto rounded-xl border border-surface-border bg-white shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center justify-between gap-4 py-2">
                <div className="h-5 w-5 rounded bg-slate-100" />
                <div className="h-4 w-1/3 rounded bg-slate-100" />
                <div className="h-4 w-1/6 rounded bg-slate-100" />
                <div className="h-4 w-1/4 rounded bg-slate-100" />
                <div className="h-5 w-5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredAssignments.length > 0 ? (
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-Typography-muted">
                <th className="w-14 px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5">Assignment</th>
                <th className="hidden px-5 py-3.5 lg:table-cell">Course</th>
                <th className="hidden px-5 py-3.5 md:table-cell">Deadline</th>
                <th className="w-20 px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAssignments.map(
                ({ id, assignment_name, courses, deadline, isDone }) => {
                  const deadlineStatus = getDeadlineStatus(deadline, isDone);

                  return (
                    <tr
                      key={id}
                      className={`group transition-colors hover:bg-indigo-50/20 ${
                        isDone ? "bg-slate-50/50" : ""
                      }`}
                    >
                      {/* Status Checkbox */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleDone(id, isDone)}
                          className={`flex h-6 w-6 mx-auto items-center justify-center rounded-lg border transition-all cursor-pointer ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                              : "border-slate-300 bg-white hover:border-emerald-500 text-transparent"
                          }`}
                          title={isDone ? "Mark as pending" : "Mark as completed"}
                        >
                          <BiCheck className="text-base font-bold" />
                        </button>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <span
                          className={`font-semibold capitalize block transition-all ${
                            isDone
                              ? "line-through text-Typography-muted opacity-70"
                              : "text-Typography-primary"
                          }`}
                        >
                          {assignment_name}
                        </span>
                        <div className="flex items-center gap-2 mt-1 md:hidden text-xs">
                          <span className="text-Typography-muted">
                            {courses?.topic_name || "General"}
                          </span>
                          {deadline && (
                            <span className="text-rose-500 font-medium">
                              • {formatDeadline(deadline)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="hidden lg:table-cell px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {courses?.topic_name || "General"}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="hidden md:table-cell px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              deadlineStatus === "overdue"
                                ? "text-rose-600 font-bold"
                                : deadlineStatus === "today"
                                ? "text-amber-600 font-bold"
                                : "text-Typography-secondary"
                            }`}
                          >
                            <BiCalendar className="text-sm" />
                            {formatDeadline(deadline)}
                          </span>

                          {deadlineStatus === "overdue" && (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 ring-1 ring-rose-500/20">
                              Overdue
                            </span>
                          )}
                          {deadlineStatus === "today" && (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-500/20">
                              Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Assignment"
                        >
                          <BiTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <MdOutlineAssignmentLate className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-bold text-Typography-primary">
                {filter === "all"
                  ? "No Assignments Found"
                  : `No ${filter} assignments`}
              </h4>
              <p className="mt-1 text-xs text-Typography-secondary max-w-sm">
                Keep on top of your deliverables by tracking homework, essays, and exam deadlines.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddAssignment(true)}
              className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-brand-primary/25 transition-all hover:bg-brand-dark active:scale-95 cursor-pointer"
            >
              <BiPlus className="text-lg" />
              <span>Create Assignment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTable;