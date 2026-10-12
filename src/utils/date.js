/**
 * Converts a Date object or timestamp string to local YYYY-MM-DD
 * @param {string | Date} dateInput
 * @returns {string} YYYY-MM-DD
 */
export const toDateKey = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats time only (e.g. 11:59 PM)
 * @param {string | Date} dateInput
 * @returns {string}
 */
export const formatTimeOnly = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats full date and time for deadlines (e.g. Oct 14, 11:59 PM)
 * @param {string | Date} dateInput
 * @returns {string}
 */
export const formatDeadline = (dateInput) => {
  if (!dateInput) return "No deadline";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculates deadline urgency status: 'overdue' | 'today' | 'upcoming' | null
 * @param {string | Date} time
 * @param {boolean} isDone
 * @returns {'overdue' | 'today' | 'upcoming' | null}
 */
export const getDeadlineStatus = (time, isDone = false) => {
  if (!time || isDone) return null;
  const now = new Date();
  const due = new Date(time);
  if (due < now) return "overdue";
  const diffHours = (due - now) / (1000 * 60 * 60);
  if (diffHours <= 24) return "today";
  return "upcoming";
};
