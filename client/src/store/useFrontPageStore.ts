import { create } from 'zustand';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy } from 'firebase/firestore';
import { Course, Student, Teacher, FrontPageType } from '@/types/frontPage';

interface FrontPageStore {
  // Form State
  type: FrontPageType;
  title: string;
  date: Date;
  selectedCourse: Course | null;
  selectedTeacher: Teacher | null;
  selectedStudent: Student | null;
  selectedStudents: Student[];

  // Cache Data
  courses: Course[];
  teachers: Teacher[];
  students: Student[];
  loading: boolean;
  
  // Actions
  setType: (type: FrontPageType) => void;
  setTitle: (title: string) => void;
  setDate: (date: Date) => void;
  setCourse: (course: Course | null) => void;
  setTeacher: (teacher: Teacher | null) => void;
  setStudent: (student: Student | null) => void;
  setSelectedStudents: (students: Student[]) => void;
  resetForm: () => void;
  
  // Data Operations
  fetchData: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
}

export const useFrontPageStore = create<FrontPageStore>((set, get) => ({
  // Initial State
  type: 'assignment',
  title: '',
  date: new Date(),
  selectedCourse: null,
  selectedTeacher: null,
  selectedStudent: null,
  selectedStudents: [],
  
  courses: [],
  teachers: [],
  students: [],
  loading: false,

  // Setters
  setType: (type) => set({ type }),
  setTitle: (title) => set({ title }),
  setDate: (date) => set({ date }),
  setCourse: (selectedCourse) => set({ selectedCourse }),
  setTeacher: (selectedTeacher) => set({ selectedTeacher }),
  setStudent: (selectedStudent) => set({ selectedStudent }),
  setSelectedStudents: (selectedStudents) => set({ selectedStudents }),
  resetForm: () => set({
    type: 'assignment',
    title: '',
    date: new Date(),
    selectedCourse: null,
    selectedTeacher: null,
    selectedStudent: null,
    selectedStudents: [],
  }),

  // Data Operations
  fetchData: async () => {
    set({ loading: true });
    try {
      const coursesSnap = await getDocs(query(collection(db, 'courses'), orderBy('code')));
      const teachersSnap = await getDocs(query(collection(db, 'teachers'), orderBy('name')));
      const studentsSnap = await getDocs(query(collection(db, 'students'), orderBy('studentId'))); // Order by ID usually makes sense

      const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      const teachers = teachersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
      const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));

      set({ courses, teachers, students, loading: false });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      set({ loading: false });
    }
  },

  addCourse: async (courseData) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), courseData);
      const newCourse = { id: docRef.id, ...courseData };
      set((state) => ({ 
        courses: [...state.courses, newCourse].sort((a, b) => a.code.localeCompare(b.code)) 
      }));
    } catch (error) {
      console.error("Failed to add course:", error);
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const docRef = doc(db, 'courses', id);
      await setDoc(docRef, courseData, { merge: true });
      set((state) => ({
        courses: state.courses.map(c => c.id === id ? { ...c, ...courseData } : c)
          .sort((a, b) => a.code.localeCompare(b.code)),
        selectedCourse: state.selectedCourse?.id === id ? { ...state.selectedCourse, ...courseData } : state.selectedCourse
      }));
    } catch (error) {
      console.error("Failed to update course:", error);
      throw error;
    }
  },

  addTeacher: async (teacherData) => {
    try {
      const docRef = await addDoc(collection(db, 'teachers'), teacherData);
      const newTeacher = { id: docRef.id, ...teacherData };
      set((state) => ({ 
        teachers: [...state.teachers, newTeacher].sort((a, b) => a.name.localeCompare(b.name)) 
      }));
    } catch (error) {
      console.error("Failed to add teacher:", error);
      throw error;
    }
  },

  updateTeacher: async (id, teacherData) => {
    try {
      const docRef = doc(db, 'teachers', id);
      await setDoc(docRef, teacherData, { merge: true });
      set((state) => ({
        teachers: state.teachers.map(t => t.id === id ? { ...t, ...teacherData } : t)
          .sort((a, b) => a.name.localeCompare(b.name)),
        selectedTeacher: state.selectedTeacher?.id === id ? { ...state.selectedTeacher, ...teacherData } : state.selectedTeacher
      }));
    } catch (error) {
      console.error("Failed to update teacher:", error);
      throw error;
    }
  },

  addStudent: async (studentData) => {
    try {
      if (!studentData.studentId) throw new Error("Student ID is required");
      
      // Use studentId as the document ID to ensure uniqueness
      const docRef = doc(db, 'students', studentData.studentId);
      await setDoc(docRef, studentData, { merge: true });
      
      const newStudent = { id: studentData.studentId, ...studentData };
      
      set((state) => {
        // Check if student already exists
        const existingIndex = state.students.findIndex(s => s.studentId === newStudent.studentId);
        let updatedStudents;
        
        if (existingIndex >= 0) {
          // Update existing
          updatedStudents = [...state.students];
          updatedStudents[existingIndex] = newStudent;
        } else {
          // Add new
          updatedStudents = [...state.students, newStudent];
        }
        
        return { 
          students: updatedStudents.sort((a, b) => a.studentId.localeCompare(b.studentId)) 
        };
      });
    } catch (error) {
      console.error("Failed to add student:", error);
      throw error;
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const docRef = doc(db, 'students', id);
      await setDoc(docRef, studentData, { merge: true });
      set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...studentData } : s)
          .sort((a, b) => a.studentId.localeCompare(b.studentId)),
        selectedStudent: state.selectedStudent?.id === id ? { ...state.selectedStudent, ...studentData } : state.selectedStudent,
        selectedStudents: state.selectedStudents.map(s => s.id === id ? { ...s, ...studentData } : s)
      }));
    } catch (error) {
      console.error("Failed to update student:", error);
      throw error;
    }
  },
}));
