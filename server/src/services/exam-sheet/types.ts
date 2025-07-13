/**
 * Represents a single course exam schedule.
 */
export interface Course {
  batch: string;
  section: string;
  courseCode: string;
  date: string | null;
  time: string | null;
  weekday: string | null;
}

/**
 * Represents a full schedule table for a specific semester.
 * Contains deduplicated course data and a map of all sections for each batch.
 */
export interface Schedule {
  titles: string[];
  semester: string;
  table: {
    dates: string[];
    times: string[];
    weekDays: string[];
  };
  // Note: This array will only contain courses from the *first* section of each batch.
  courses: Course[];
  // This map holds all sections found for each batch.
  batchSections: { [batch: string]: string[] };
}

/**
 * Represents a single exam entry in the final JSON output.
 */
export interface Exam {
  subject: string;
  weekday: string | null;
  time: string | null;
  date: string | null;
  shift: "Morning" | "Evening";
}

/**
 * Represents the schedule for a specific batch, including all its sections.
 */
export interface BatchSchedule {
  batch: string;
  sections: string[];
  exams: Exam[];
}

/**
 * Represents the final JSON structure for a single schedule table.
 */
export interface JsonScheduleOutput {
  department: string;
  title: string;
  semester: string;
  schedules: BatchSchedule[];
}
