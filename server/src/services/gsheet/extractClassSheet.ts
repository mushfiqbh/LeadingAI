import {
  BatchSchedule,
  ClassRoutineData,
  RoutineMetadata,
  SectionSchedule,
  WeeklyDaySchedule,
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
 * @returns {Promise<ClassRoutineData | null>} A promise that resolves to the final routine data.
 */
export default async function extractClassRoutineSheet(
  spreadsheetId: string
): Promise<ClassRoutineData | null> {
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
  const batchMap = new Map<string, Map<string, WeeklyDaySchedule[]>>();

  for (const day of days) {
    console.log(`-> Processing ${day}...`);
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
      if (masterMetadata)
        console.log(
          `   Master metadata found in ${day}'s sheet. This will be used as a fallback.`
        );
    }

    if (!masterMetadata) {
      console.log(
        `Skipping ${day} because no header metadata has been found in any sheet yet.`
      );
      continue;
    }

    for (const row of parsedData) {
      if (RowIdentifier.isSchedule(row)) {
        const dailySchedule = parseDailySchedule(row, masterMetadata.times);
        if (dailySchedule && dailySchedule.classes.length > 0) {
          const { batch, section, classes } = dailySchedule;

          if (!batchMap.has(batch))
            batchMap.set(batch, new Map<string, WeeklyDaySchedule[]>());
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

  const schedules: BatchSchedule[] = [];
  for (const [batch, sectionMap] of batchMap.entries()) {
    const sections: SectionSchedule[] = [];
    for (const [section, weeklySchedule] of sectionMap.entries()) {
      sections.push({ section, weeklySchedule });
    }
    sections.sort((a, b) => a.section.localeCompare(b.section));
    schedules.push({ batch, sections });
  }
  schedules.sort((a, b) =>
    a.batch.localeCompare(b.batch, undefined, { numeric: true })
  );

  console.log(
    `\n--- Finished parsing. Found routines for ${schedules.length} batches. ---`
  );

  const { title, department, semester } = masterMetadata;

  return {
    title,
    department,
    semester,
    schedules,
  };
}
