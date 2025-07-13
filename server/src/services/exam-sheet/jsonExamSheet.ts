import { BatchSchedule, Exam, JsonScheduleOutput, Schedule } from "./types";

/**
 * Generates a JSON object from an array of structured Schedule objects.
 * It applies the deduplicated exam data to all relevant sections.
 * @param schedules - An array of Schedule objects from the extractSchedules function.
 * @returns An array of objects in the desired final JSON format.
 */
export default function generateJsonFromSchedules(
  schedules: Schedule[]
): JsonScheduleOutput | null {
  if (!schedules || schedules.length === 0) {
    return null;
  }

  const mergedSchedules = new Map<string, BatchSchedule>();

  // Use metadata from the first table
  const titles = schedules[0].titles;
  const semester = schedules[0].semester;

  // Iterate through each schedule (morning table, evening table, etc.)
  schedules.forEach((schedule, index) => {
    const shift = index === 0 ? "Morning" : "Evening";

    // Group the deduplicated courses by batch for the current schedule
    const coursesByBatch = new Map<string, Exam[]>();
    for (const course of schedule.courses) {
      if (!coursesByBatch.has(course.batch)) {
        coursesByBatch.set(course.batch, []);
      }
      coursesByBatch.get(course.batch)!.push({
        subject: course.courseCode,
        weekday: course.weekday,
        time: course.time,
        date: course.date,
        shift: shift,
      });
    }

    // Merge the processed data into the main map
    for (const batchNumber of Object.keys(schedule.batchSections)) {
      const examsForBatch = coursesByBatch.get(batchNumber) || [];
      const sectionsForBatch = schedule.batchSections[batchNumber].sort();

      if (examsForBatch.length > 0) {
        // If the batch already exists in our merged map, update it
        if (mergedSchedules.has(batchNumber)) {
          const existingEntry = mergedSchedules.get(batchNumber)!;
          existingEntry.exams.push(...examsForBatch);
          // Combine sections and remove duplicates
          const allSections = new Set([
            ...existingEntry.sections,
            ...sectionsForBatch,
          ]);
          existingEntry.sections = Array.from(allSections).sort();
        } else {
          // Otherwise, create a new entry
          mergedSchedules.set(batchNumber, {
            batch: batchNumber,
            sections: sectionsForBatch,
            exams: examsForBatch,
          });
        }
      }
    }
  });

  // Convert map to array and sort by batch number
  const finalSchedules = Array.from(mergedSchedules.values()).sort(
    (a, b) => Number(b.batch) - Number(a.batch)
  );

  return {
    department: titles[0] || "Unknown Department",
    title: titles[1] || "Unknown Routine",
    semester,
    schedules: finalSchedules,
  };
}
