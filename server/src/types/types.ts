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

// Required when parsing class schedules
export interface DailySchedule {
  batch: string;
  section: string;
  classes: Class[];
}

export interface ClassSchedule {
  day: string;
  classes: Class[];
}

export interface Exam {
  course: string;
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

export interface RoutineData {
  id?: string;
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

export interface FileMetadata {
  id: string;
  title: string;
  alternateLink: string;
  webContentLink: string;
  fileSize: string; // Size in bytes as a string
}

export interface FrontPageData {
  id: string;
  title: string;
  date: Date;
  course: {
    code: string;
    title: string;
  };
  teacher: {
    name: string;
    faculty: string;
    designation: string;
  };
  student: {
    id: string;
    name: string;
    batch: string;
    section: string;
    dept: string;
  };
}
