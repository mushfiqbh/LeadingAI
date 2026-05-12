import { RoutineData, ExamSchedule, FlatSchedule } from "../../types/types";
import refineDepartmentName from "../../utils/refineDepartmentName";
import { RowIdentifier, csvParser } from "./helperFunctions";

/**
 * Parses raw table data and generates a single, merged JSON schedule in one pass.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @return {Promise<RoutineData | null>} A promise that resolves to the final routine data.
 */
export default async function extractExamRoutineSheet(
  spreadsheetId: string
): Promise<RoutineData | null> {
  const parsedData = await csvParser(spreadsheetId, "Sheet1");

  if (!parsedData || parsedData.length === 0) {
    return null;
  }

  // --- State for the entire process ---
  let title: string = "";
  let department: string = "";
  let semester: string = "";
  const mergedSchedules = new Map<string, ExamSchedule>();

  // --- State for tracking the current table being parsed ---
  let tableIndex = -1;
  const tableHeaders: {
    dates: string[];
    timeSlots: string[];
    weekDays: string[];
  }[] = [];
  let currentBatch: string | null = null;
  const processedBatchesPerTable = new Set<string>();

  for (const row of parsedData) {
    if (row.every((cell) => cell.trim() === "")) continue;
    const firstCell = row.find((cell) => cell.trim() !== "") || "";

    // Capture titles and semester only from the first table
    if (tableIndex < 0) {
      if (RowIdentifier.isTitle(firstCell)) {
        const trimmedTitle = firstCell.trim();
        if (trimmedTitle.includes("Department of")) {
          department = refineDepartmentName(trimmedTitle);
        } else {
          title = trimmedTitle;
        }
        continue;
      }
      if (RowIdentifier.isSemester(firstCell)) {
        semester = firstCell.trim();
        continue;
      }
    }

    const contentCells = row.slice(2);

    // A date row signifies the start of a new table's headers
    if (contentCells.some((c) => RowIdentifier.isDate(c))) {
      tableIndex++;
      tableHeaders[tableIndex] = {
        dates: contentCells.filter((c) => c.trim() !== ""),
        timeSlots: [],
        weekDays: [],
      };
      processedBatchesPerTable.clear(); // Reset for the new table
      continue;
    }

    if (tableIndex > -1 && contentCells.some((c) => RowIdentifier.isTime(c))) {
      const timeCells = contentCells.filter((c) => c.trim() !== "");
      tableHeaders[tableIndex].timeSlots = timeCells;
      continue;
    }
    if (
      tableIndex > -1 &&
      contentCells.some((c) => RowIdentifier.isWeekday(c))
    ) {
      tableHeaders[tableIndex].weekDays = contentCells.filter(
        (c) => c.trim() !== ""
      );
      continue;
    }

    // Process course rows
    const potentialBatch = row[0]?.trim() || "";
    const potentialSection = row[1]?.trim() || "";

    if (RowIdentifier.isBatch(potentialBatch)) {
      currentBatch = potentialBatch;
    }

    if (
      tableIndex > -1 &&
      currentBatch &&
      RowIdentifier.isSection(potentialSection)
    ) {
      const shift = tableIndex === 0 ? "Morning" : "Evening";
      const headers = tableHeaders[tableIndex];

      // Get or create the main entry for this batch
      if (!mergedSchedules.has(currentBatch)) {
        mergedSchedules.set(currentBatch, {
          batch: currentBatch,
          sections: [],
          exams: [],
        });
      }
      const batchEntry = mergedSchedules.get(currentBatch)!;

      // Add the section if it's not already listed for this batch
      if (!batchEntry.sections.includes(potentialSection)) {
        batchEntry.sections.push(potentialSection);
      }

      // Only parse exams for a batch once per table (morning/evening)
      if (!processedBatchesPerTable.has(currentBatch)) {
        const courseEntries = row.slice(2);
        courseEntries.forEach((course, index) => {
          if (RowIdentifier.isCourseCode(course.trim())) {
            batchEntry.exams.push({
              course: course.trim().split(" ")[0],
              date: headers.dates[index] || null,
              time: headers.timeSlots[index] || null,
              weekday: headers.weekDays[index] || null,
              shift: shift,
            });
          }
        });
        processedBatchesPerTable.add(currentBatch);
      }
    }
  }

  // Flatten the map into the final array structure
  const finalSchedules: FlatSchedule[] = [];
  for (const [batch, schedule] of mergedSchedules.entries()) {
    finalSchedules.push({
      batch: schedule.batch,
      section: "All-Sections",
      content: JSON.stringify(schedule.exams),
    });
  }

  return {
    title,
    department,
    semester,
    timeSlots: Array.from(
      new Set(tableHeaders.flatMap((header) => header.timeSlots))
    ),
    schedules: finalSchedules,
  };
}
