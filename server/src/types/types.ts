export interface RoutineMetadata {
  title: string;
  department: string;
  semester: string;
  timeSlots: string[];
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

export interface FlatSchedule {
  batch: string;
  section: string;
  content: string;
  imageUrl?: string;
  filename?: string;
}

// This file defines the types used in the application for routines, schedules, and metadata.
export interface ClassRoutineData {
  id?: string;
  title: string;
  department: string;
  semester: string;
  timeSlots: string[];
  schedules: FlatSchedule[];
}

// This interface is used to represent the data structure for exam routines.
export interface ExamRoutineData {
  title: string;
  department: string;
  semester: string;
  timeSlots: string[];
  schedules: FlatSchedule[];
}

export interface RoutineOptions {
  department: string;
  semester: string;
  batch: number;
  section: string;
  timeSlots: string[];
}
