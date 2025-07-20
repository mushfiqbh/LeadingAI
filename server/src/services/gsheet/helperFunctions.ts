import { Class, DailySchedule, RoutineMetadata } from "../../types/types";
import refineDepartmentName from "../../utils/refineDepartmentName";

/**
 * Fetches data from a public Google Sheet and parses it as a 2D array.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @param {string} sheetName - The name of the sheet to parse.
 * @returns {Promise<string[][]>} A promise that resolves to the parsed 2D array data.
 */
export const csvParser = async (
  spreadsheetId: string,
  sheetName: string
): Promise<string[][]> => {
  const csvUrl = `https://docs.google.com/spreadsheets/u/0/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

  try {
    const res = await fetch(csvUrl);
    if (!res.ok) {
      console.warn(
        `   Could not fetch sheet for: ${sheetName}. It might not exist.`
      );
      return [];
    }
    const csvText = await res.text();
    return csvText
      .split(/\r?\n/)
      .map((line) =>
        line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
      );
  } catch (error) {
    console.error(
      `Error fetching or parsing CSV for sheet: ${sheetName}`,
      error
    );
    return [];
  }
};

/**
 * An object containing methods to identify the type of a row.
 */
export const RowIdentifier = {
  isUniversity: (row: any[]): boolean =>
    row.some(
      (cell) => typeof cell === "string" && cell.includes("Leading University")
    ),
  isDepartment: (row: any[]): boolean =>
    row.some(
      (cell) => typeof cell === "string" && cell.includes("Department of")
    ),
  isHeader: (row: any[]): boolean =>
    row.some(
      (cell) => typeof cell === "string" && cell.includes("Class Routine")
    ),
  isSchedule: (row: any[]): boolean =>
    typeof row[1] === "string" &&
    /^\d+$/.test(row[1]) &&
    typeof row[2] === "string" &&
    /^[A-Z]/.test(row[2]),
  isDate: (s: string): boolean =>
    /^\d{1,2}\/\d{1,2}\/(\d{4}|\d{2})$/.test(s.trim()),
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
    /^(Summer|SUMMER|Fall|FALL|Spring|SPRING)'\d{2}$/.test(s.trim()),
  isEmpty: (row: any[]): boolean => row.every((cell) => cell === ""),
};

/**
 * Parses a single schedule row into a structured DailySchedule object.
 * @param {any[]} row - A single row identified as a 'schedule' type.
 * @param {string[]} timeSlots - The array of time strings from the header.
 * @returns {DailySchedule | null} A structured schedule object or null if parsing fails.
 */
export const parseDailySchedule = (
  row: any[],
  timeSlots: string[]
): DailySchedule | null => {
  try {
    const batch = String(row[1]);
    const section = String(row[2]);
    const classes: Class[] = [];
    const courseCells = row.slice(3);

    timeSlots.forEach((time, index) => {
      const cellValue = courseCells[index]
        ? String(courseCells[index]).trim()
        : "";
      const course = cellValue.length >= 5 ? cellValue : null;
      if (course) {
        classes.push({ course, time, slot: index + 1 });
      }
    });

    return { batch, section, classes };
  } catch (error) {
    console.error("Error parsing schedule row:", row, error);
    return null;
  }
};

/**
 * Extracts metadata (title, department, timeSlots, etc.) from a sheet's raw data.
 * @param data The 2D array of a sheet's data.
 * @returns An object with the metadata, or null if not found.
 */
export const extractMetadata = (
  data: (string | number)[][]
): RoutineMetadata | null => {
  let title = "",
    department = "",
    semester = "",
    timeSlots: string[] = [];

  for (const row of data) {
    if (RowIdentifier.isDepartment(row))
      department = refineDepartmentName(String(row[0]).trim());
    else if (RowIdentifier.isHeader(row)) {
      title = String(row[0]).trim();
      const semesterAndDay = String(row[1]).split(" ");
      semester = semesterAndDay[0];
      timeSlots = row.slice(4).map((time) => String(time).trim());
    }
  }

  if (title && department && semester && timeSlots.length > 0) {
    return { title, department, semester, timeSlots };
  }
  return null;
};
