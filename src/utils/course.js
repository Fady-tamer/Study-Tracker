/**
 * Formats study minutes into human readable text (e.g. '45m', '2h 15m')
 * @param {number} totalMinutes
 * @returns {string}
 */
export const formatStudyTime = (totalMinutes = 0) => {
  const mins = Math.max(0, Math.round(Number(totalMinutes) || 0));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
};

/**
 * Calculates curriculum completion percentage (0-100)
 * @param {number} total
 * @param {number} done
 * @returns {number}
 */
export const calcProgress = (total, done = 0) => {
  if (!total || total <= 0) return 0;
  const progress = Math.min(100, Math.max(0, (done / total) * 100));
  return Number(progress.toFixed(0));
};

/**
 * Calculates completion status string
 * @param {number} total
 * @param {number} done
 * @returns {'Completed' | 'In Progress'}
 */
export const calcStatus = (total, done = 0) => {
  if (total > 0 && done >= total) return "Completed";
  return "In Progress";
};

/**
 * Safely reads completed chapters array length from localStorage
 * @param {string} courseId
 * @param {number} fallback
 * @returns {number}
 */
export const getCourseDoneChapters = (courseId, fallback = 0) => {
  try {
    const stored = localStorage.getItem(`chapters_${courseId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.length;
    }
  } catch {}
  return Number(fallback) || 0;
};
