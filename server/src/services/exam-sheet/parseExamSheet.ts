import { Course, Schedule } from "./types";
import { RowIdentifier } from "./rowIdentifier";

/**
 * Parses the raw 2D array data into a structured array of schedule objects.
 * It intelligently handles redundant data by only parsing the first section of each batch.
 * @param parsedData - The 2D array representing the raw schedule data.
 * @returns An array of structured schedule objects with deduplicated course info.
 */
export default function parseExamSheet(parsedData: string[][]): Schedule[] {
  const schedules: Schedule[] = [];
  let titles: string[] = [];
  let semester: string = "";
  let table: { dates: string[]; times: string[]; weekDays: string[] } = {
    dates: [],
    times: [],
    weekDays: [],
  };
  let courses: Course[] = [];
  let currentBatch: string | null = null;

  // --- New additions for optimization ---
  let batchSections: { [batch: string]: string[] } = {};
  let processedBatches = new Set<string>();

  const finalizeCurrentSchedule = () => {
    if (
      (courses.length > 0 || Object.keys(batchSections).length > 0) &&
      semester
    ) {
      schedules.push({
        titles: [...titles],
        semester,
        table: { ...table },
        courses: [...courses],
        batchSections: { ...batchSections },
      });
    }
    // Reset state for the next schedule
    titles = [];
    semester = "";
    table = { dates: [], times: [], weekDays: [] };
    courses = [];
    currentBatch = null;
    batchSections = {};
    processedBatches.clear();
  };

  for (const row of parsedData) {
    if (row.every((cell) => cell.trim() === "")) continue;
    const firstCell = row.find((cell) => cell.trim() !== "") || "";

    if (
      RowIdentifier.isTitle(firstCell) &&
      (courses.length > 0 || Object.keys(batchSections).length > 0)
    ) {
      finalizeCurrentSchedule();
    }

    if (RowIdentifier.isTitle(firstCell)) {
      titles.push(firstCell.trim());
      continue;
    }
    if (RowIdentifier.isSemester(firstCell)) {
      semester = firstCell.trim();
      continue;
    }

    const contentCells = row.slice(2);
    if (contentCells.some((c) => RowIdentifier.isDate(c))) {
      table.dates = contentCells.filter((c) => c.trim() !== "");
      continue;
    }
    if (contentCells.some((c) => RowIdentifier.isTime(c))) {
      table.times = contentCells.filter((c) => c.trim() !== "");
      continue;
    }
    if (contentCells.some((c) => RowIdentifier.isWeekday(c))) {
      table.weekDays = contentCells.filter((c) => c.trim() !== "");
      continue;
    }

    const potentialBatch = row[0].trim();
    const potentialSection = row[1].trim();

    if (RowIdentifier.isBatch(potentialBatch)) {
      currentBatch = potentialBatch;
    }

    if (RowIdentifier.isSection(potentialSection) && currentBatch) {
      const section = potentialSection;

      // Record all sections for the current batch
      if (!batchSections[currentBatch]) {
        batchSections[currentBatch] = [];
      }
      batchSections[currentBatch].push(section);

      // If we've already processed this batch's exams, skip to the next row
      if (processedBatches.has(currentBatch)) {
        continue;
      }

      // Process the first section of this batch to get exam data
      const courseEntries = row.slice(2);
      courseEntries.forEach((course, index) => {
        if (RowIdentifier.isCourseCode(course.trim())) {
          courses.push({
            batch: currentBatch as string,
            section: section, // We still note it's from section 'A' (or the first found)
            courseCode: course.trim(),
            date: table.dates[index] || null,
            time: table.times[index] || null,
            weekday: table.weekDays[index] || null,
          });
        }
      });
      // Mark this batch as processed so we don't re-read its exam data
      processedBatches.add(currentBatch);
    }
  }

  finalizeCurrentSchedule();

  return schedules;
}
