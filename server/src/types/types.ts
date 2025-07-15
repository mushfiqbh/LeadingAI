export interface Exam {
  subject: string;
  weekday: string | null;
  time: string | null;
  date: string | null;
  shift: "Morning" | "Evening";
}

export interface ExamSchedule {
  batch: string;
  sections: string[];
  exams: Exam[];
}

export interface RoutineMetadata {
  title: string;
  department: string;
  semester: string;
  times: string[];
}

export interface Class {
  course: string;
  time: string;
  slot: number;
}

export interface DailySchedule {
  batch: string;
  section: string;
  classes: Class[];
}

export interface WeeklyDaySchedule {
  day: string;
  classes: Class[];
}

export interface SectionSchedule {
  section: string;
  weeklySchedule: WeeklyDaySchedule[];
}

export interface BatchSchedule {
  batch: string;
  sections: SectionSchedule[];
}

// This file defines the types used in the application for routines, schedules, and metadata.
export interface ClassRoutineData {
  title: string;
  department: string;
  semester: string;
  schedules: BatchSchedule[];
}

// This interface is used to represent the data structure for exam routines.
export interface ExamRoutineData {
  title: string;
  department: string;
  semester: string;
  schedules: ExamSchedule[];
}
