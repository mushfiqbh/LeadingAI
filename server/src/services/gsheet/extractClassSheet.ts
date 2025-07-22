import {
  RoutineData,
  FlatSchedule,
  RoutineMetadata,
  ClassSchedule,
} from "../../types/types";
import {
  csvParser,
  extractMetadata,
  parseDailySchedule,
  RowIdentifier,
} from "./helperFunctions";

// -----------------
// EXECUTION ORCHESTRATOR
// -----------------

/**
 * Main execution function to fetch and parse routines for a full week,
 * directly creating a section-wise data structure.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @returns {Promise<RoutineData | null>} A promise that resolves to the final routine data.
 */
export default async function extractClassRoutineSheet(
  spreadsheetId: string
): Promise<RoutineData | null> {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let masterMetadata: RoutineMetadata | null = null;
  const batchMap = new Map<string, Map<string, ClassSchedule[]>>();

  for (const day of days) {
    const parsedData = await csvParser(spreadsheetId, day);

    if (
      parsedData.length === 0 ||
      parsedData.flat().every((cell) => cell === "")
    ) {
      console.log(
        `   Sheet for ${day} is empty or could not be fetched. Skipping.`
      );
      continue;
    }

    if (!masterMetadata) {
      masterMetadata = extractMetadata(parsedData);
    }

    if (!masterMetadata) {
      console.log(
        `Skipping ${day} because no header metadata has been found in any sheet yet.`
      );
      continue;
    }

    for (const row of parsedData) {
      if (RowIdentifier.isSchedule(row)) {
        const dailySchedule = parseDailySchedule(row, masterMetadata.timeSlots);
        if (dailySchedule && dailySchedule.classes.length > 0) {
          const { batch, section, classes } = dailySchedule;

          if (!batchMap.has(batch))
            batchMap.set(batch, new Map<string, ClassSchedule[]>());
          const sectionMap = batchMap.get(batch)!;

          if (!sectionMap.has(section)) sectionMap.set(section, []);
          const weeklySchedule = sectionMap.get(section)!;

          weeklySchedule.push({ day, classes });
        }
      }
    }
  }

  if (!masterMetadata) {
    console.error(
      "\nCould not find metadata in any sheet. Cannot build routine."
    );
    return null;
  }

  const { title, department, semester } = masterMetadata;

  // Flatten the map into the final array structure
  const finalSchedules: FlatSchedule[] = [];
  for (const [batch, sectionMap] of batchMap.entries()) {
    for (const [section, weeklySchedule] of sectionMap.entries()) {
      finalSchedules.push({
        batch: batch,
        section: section,
        content: JSON.stringify(weeklySchedule),
      });
    }
  }

  return {
    title,
    department,
    semester,
    timeSlots: masterMetadata.timeSlots,
    schedules: finalSchedules,
  };
}
