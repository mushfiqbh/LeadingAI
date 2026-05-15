export interface Course {
  id?: string; // Firebase Document ID
  code: string;
  title: string;
  keywords?: string;
}

export interface Teacher {
  id?: string;
  code?: string;
  name: string;
  faculty: string;
  designation: string;
}

export interface Student {
  id?: string; // Firebase Document ID
  studentId: string; // The actual Student ID (e.g. 182202001)
  name: string;
  batch: string;
  section: string;
  dept: string;
}

export type FrontPageType = 'assignment' | 'labReport';

export interface FrontPageState {
  type: FrontPageType;
  title: string;
  date: Date;
  selectedCourse: Course | null;
  selectedTeacher: Teacher | null;
  selectedStudent: Student | null;
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
  isGroup?: boolean;
  groupTitle?: string;
  students?: Student[];
}