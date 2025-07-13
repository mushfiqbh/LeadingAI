/**
 * A collection of helper functions to identify the type of data in a row.
 */
export const RowIdentifier = {
  isDate: (s: string): boolean => /^\d{2}\/\d{2}\/\d{4}$/.test(s.trim()),
  isTime: (s: string): boolean =>
    /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(s.trim()),
  isWeekday: (s: string): boolean => {
    const weekdays = [
      "saturday",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];
    return weekdays.includes(s.trim().toLowerCase());
  },
  isCourseCode: (s: string): boolean =>
    /^[A-Z]{3}-\d{4} \(\d+\)$/.test(s.trim()),
  isBatch: (s: string): boolean => /^\d+$/.test(s.trim()),
  isSection: (s: string): boolean => /^[A-Z](\+[A-Z])?$/.test(s.trim()),
  isTitle: (s: string): boolean =>
    s.includes("Department of") || s.includes("Examination Routine"),
  isSemester: (s: string): boolean =>
    /^(Summer|Fall|Spring)'\d{2}$/.test(s.trim()),
};
