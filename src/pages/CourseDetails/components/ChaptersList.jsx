import { useState } from "react";
import {
  BiPlus,
  BiTrash,
  BiChevronDown,
  BiChevronUp,
  BiTask,
  BiBookOpen,
} from "react-icons/bi";
import { BsCheckSquareFill, BsSquare } from "react-icons/bs";
import ProgressBar from "../../../components/ProgressBar";

const ChaptersList = ({
  chapters = [],
  onToggleChapter,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddChapter,
  onDeleteChapter,
}) => {
  // Store expanded state per chapter (all expanded by default for easy access)
  const [expandedIds, setExpandedIds] = useState(() => {
    const initial = {};
    chapters.forEach((ch) => {
      initial[ch.id] = true;
    });
    return initial;
  });

  // Track task inputs per chapter
  const [taskInputs, setTaskInputs] = useState({});
  const [isAddingTask, setIsAddingTask] = useState({});

  // Track chapter creator modal/form
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isSubmittingChapter, setIsSubmittingChapter] = useState(false);

  const toggleExpand = (chapterId) => {
    setExpandedIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleTaskSubmit = async (e, chapterId) => {
    e.preventDefault();
    const title = taskInputs[chapterId]?.trim();
    if (!title) return;

    setIsAddingTask((prev) => ({ ...prev, [chapterId]: true }));
    try {
      await onAddTask(chapterId, title);
      setTaskInputs((prev) => ({ ...prev, [chapterId]: "" }));
    } finally {
      setIsAddingTask((prev) => ({ ...prev, [chapterId]: false }));
    }
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    setIsSubmittingChapter(true);
    try {
      await onAddChapter(newChapterTitle.trim());
      setNewChapterTitle("");
      setShowAddChapterForm(false);
    } finally {
      setIsSubmittingChapter(false);
    }
  };

  // Calculate totals
  const totalChapters = chapters.length;
  const completedChaptersCount = chapters.filter((c) => c.is_done).length;

  const totalTasks = chapters.reduce(
    (acc, ch) => acc + (ch.tasks?.length || 0),
    0,
  );
  const completedTasks = chapters.reduce(
    (acc, ch) =>
      acc + (ch.tasks?.filter((t) => t.is_done)?.length || 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-slate-50/60 p-4 sm:p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BiBookOpen className="text-xl text-brand-primary" />
            <h2 className="text-base sm:text-lg font-bold text-Typography-primary font-['Outfit']">
              Curriculum Chapters & Tasks
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-brand-primary ring-1 ring-brand-primary/20">
              {completedChaptersCount}/{totalChapters} Ch. Done
            </span>
          </div>
          <p className="mt-1 text-xs text-Typography-secondary">
            Break down each syllabus chapter into actionable study tasks and track your completion.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {totalTasks > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-Typography-secondary shadow-xs">
              <BiTask className="text-sm text-brand-primary" />
              <span>{completedTasks}/{totalTasks} Tasks Done</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowAddChapterForm((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-dark active:scale-95 transition-all cursor-pointer"
          >
            <BiPlus className="text-base" />
            <span>Add Chapter</span>
          </button>
        </div>
      </div>

      {/* Add Chapter Inline Form */}
      {showAddChapterForm && (
        <form
          onSubmit={handleChapterSubmit}
          className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-brand-primary/30 bg-white p-3 shadow-xs animate-in fade-in duration-150"
        >
          <input
            type="text"
            placeholder={`Chapter title (e.g., Chapter ${totalChapters + 1}: Core Concepts)...`}
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            className="w-full sm:flex-1 rounded-xl border border-surface-border bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-Typography-primary focus:border-brand-primary focus:bg-white focus:outline-none transition-colors"
            autoFocus
            required
          />
          <div className="flex w-full sm:w-auto items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAddChapterForm(false);
                setNewChapterTitle("");
              }}
              className="px-3 py-2 rounded-xl border border-surface-border bg-white text-xs font-semibold text-Typography-secondary hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingChapter || !newChapterTitle.trim()}
              className="px-4 py-2 rounded-xl bg-brand-primary text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {isSubmittingChapter ? "Saving..." : "Create Chapter"}
            </button>
          </div>
        </form>
      )}

      {/* Chapters Accordion Cards List */}
      <div className="flex flex-col gap-3">
        {chapters.length > 0 ? (
          chapters.map((chapter) => {
            const isExpanded = expandedIds[chapter.id] !== false;
            const tasksList = chapter.tasks || [];
            const chapterTotalTasks = tasksList.length;
            const chapterDoneTasks = tasksList.filter((t) => t.is_done).length;
            const chapterProgress =
              chapterTotalTasks > 0
                ? Math.round((chapterDoneTasks / chapterTotalTasks) * 100)
                : chapter.is_done
                ? 100
                : 0;

            return (
              <div
                key={chapter.id}
                className={`flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${
                  chapter.is_done
                    ? "border-emerald-200 bg-white shadow-xs"
                    : "border-surface-border bg-white shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Chapter Card Header */}
                <div className="flex flex-col gap-2 p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between bg-white border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Chapter Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleChapter(chapter.id, chapter.is_done)}
                      className="shrink-0 p-1 rounded-lg text-lg text-emerald-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title={chapter.is_done ? "Mark chapter incomplete" : "Mark chapter completed"}
                    >
                      {chapter.is_done ? (
                        <BsCheckSquareFill className="text-emerald-500 text-xl" />
                      ) : (
                        <BsSquare className="text-slate-300 hover:text-emerald-500 text-xl" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm sm:text-base font-bold capitalize truncate font-['Outfit'] ${
                            chapter.is_done
                              ? "text-emerald-800"
                              : "text-Typography-primary"
                          }`}
                        >
                          {chapter.title}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${
                            chapter.is_done
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              : "bg-slate-100 text-Typography-secondary ring-slate-200"
                          }`}
                        >
                          {chapter.is_done ? "Completed" : "In Progress"}
                        </span>
                      </div>

                      {/* Mini Task Progress Info */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-Typography-muted">
                          {chapterTotalTasks > 0
                            ? `${chapterDoneTasks} of ${chapterTotalTasks} tasks completed (${chapterProgress}%)`
                            : "No tasks added yet"}
                        </span>
                        {chapterTotalTasks > 0 && (
                          <div className="w-16 hidden sm:block">
                            <ProgressBar
                              progress={chapterProgress}
                              height="h-1.5"
                              color={
                                chapterProgress === 100
                                  ? "from-emerald-500 to-teal-400"
                                  : "from-brand-primary to-indigo-400"
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Header Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {onDeleteChapter && chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteChapter(chapter.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete chapter"
                      >
                        <BiTrash className="text-base" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(chapter.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-Typography-secondary transition-colors cursor-pointer"
                    >
                      <span>{tasksList.length} Tasks</span>
                      {isExpanded ? (
                        <BiChevronUp className="text-base" />
                      ) : (
                        <BiChevronDown className="text-base" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Tasks Body */}
                {isExpanded && (
                  <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-slate-50/40">
                    {/* Add Task Input Form */}
                    <form
                      onSubmit={(e) => handleTaskSubmit(e, chapter.id)}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`+ Add a study task to ${chapter.title} (e.g., Read section 1, solve exercises)...`}
                        value={taskInputs[chapter.id] || ""}
                        onChange={(e) =>
                          setTaskInputs({
                            ...taskInputs,
                            [chapter.id]: e.target.value,
                          })
                        }
                        className="min-w-0 flex-1 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-xs sm:text-sm text-Typography-primary focus:border-brand-primary focus:bg-white focus:outline-none transition-colors shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={
                          isAddingTask[chapter.id] ||
                          !taskInputs[chapter.id]?.trim()
                        }
                        className="flex shrink-0 items-center gap-1 rounded-xl bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-dark active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        <BiPlus className="text-base" />
                        <span>{isAddingTask[chapter.id] ? "Adding..." : "Add Task"}</span>
                      </button>
                    </form>

                    {/* Tasks List */}
                    {tasksList.length > 0 ? (
                      <div className="divide-y divide-slate-100 rounded-xl border border-surface-border bg-white overflow-hidden shadow-2xs">
                        {tasksList.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-sm transition-colors ${
                              task.is_done
                                ? "bg-slate-50/50"
                                : "hover:bg-indigo-50/20"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  onToggleTask(task.id, chapter.id, task.is_done)
                                }
                                className="shrink-0 p-0.5 rounded text-emerald-600 transition-colors cursor-pointer"
                                title={task.is_done ? "Mark pending" : "Mark done"}
                              >
                                {task.is_done ? (
                                  <BsCheckSquareFill className="text-emerald-500 text-base" />
                                ) : (
                                  <BsSquare className="text-slate-300 hover:text-emerald-500 text-base" />
                                )}
                              </button>

                              <span
                                className={`truncate font-medium transition-all ${
                                  task.is_done
                                    ? "line-through text-Typography-muted opacity-70"
                                    : "text-Typography-primary"
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteTask(task.id, chapter.id)}
                              className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete task"
                            >
                              <BiTrash className="text-sm sm:text-base" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 py-4 px-3 text-center text-xs text-Typography-muted">
                        No tasks added to this chapter yet. Use the field above to add your first study task.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center text-xs text-Typography-muted">
            No curriculum chapters found. Click &quot;Add Chapter&quot; above to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChaptersList;
