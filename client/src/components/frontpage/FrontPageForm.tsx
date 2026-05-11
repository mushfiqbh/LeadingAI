"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { useFrontPageStore } from "@/store/useFrontPageStore";
import Autocomplete from "./Autocomplete";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Skeleton } from "../ui/Skeleton";
import generateAssignment from "./generateAssignment";
import generateLabReport from "./generateLabReport";
import { Loader2, X, Users, Share2 } from "lucide-react";
import { Course, Teacher, Student } from "@/types/frontPage";
import refineDepartmentName from "@/utils/refineDepartmentName";

export default function FrontPageForm() {
  const {
    type,
    title,
    date,
    selectedCourse,
    selectedTeacher,
    selectedStudents,
    isGroupFrontPage,
    groupTitle,
    courses,
    teachers,
    students,
    loading,
    setType,
    setTitle,
    setGroupTitle,
    setIsGroupFrontPage,
    setDate,
    setCourse,
    setTeacher,
    setSelectedStudents,
    fetchData,
    addCourse,
    updateCourse,
    addTeacher,
    updateTeacher,
    addStudent,
    updateStudent,
    shareFrontPage,
    suggestedTeacherIds,
    updateCourseTeacherUsage,
  } = useFrontPageStore();

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  // New/Edit Item State
  const [newCourse, setNewCourse] = useState<{
    id?: string;
    code: string;
    title: string;
    keywords?: string;
  }>({ code: "", title: "", keywords: "" });
  const [newTeacher, setNewTeacher] = useState<{
    id?: string;
    code: string;
    name: string;
    faculty: string;
    designation: string;
  }>({
    code: "",
    name: "",
    faculty: "",
    designation: "",
  });
  const [newStudent, setNewStudent] = useState<{
    id?: string;
    studentId: string;
    name: string;
    batch: string;
    section: string;
    dept: string;
  }>({
    studentId: "",
    name: "",
    batch: "",
    section: "",
    dept: "",
  });

  const [courseQuery, setCourseQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditCourse = (course: Course) => {
    setNewCourse({
      id: course.id,
      code: course.code,
      title: course.title,
      keywords: course.keywords || "",
    });
    setIsCourseModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setNewTeacher({
      id: teacher.id,
      code: teacher.code || "",
      name: teacher.name,
      faculty: teacher.faculty,
      designation: teacher.designation,
    });
    setIsTeacherModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setNewStudent({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      batch: student.batch,
      section: student.section,
      dept: student.dept,
    });
    setIsStudentModalOpen(true);
  };

  const filteredCourses = courses.filter(
    (c: Course) =>
      c.code.toLowerCase().includes(courseQuery.trim().toLowerCase()) ||
      c.title.toLowerCase().includes(courseQuery.trim().toLowerCase()) ||
      c.keywords?.toLowerCase().includes(courseQuery.trim().toLowerCase()),
  );

  const filteredTeachers = teachers
    .filter(
      (t: Teacher) =>
        t.name.toLowerCase().includes(teacherQuery.trim().toLowerCase()) ||
        t.faculty.toLowerCase().includes(teacherQuery.trim().toLowerCase()) ||
        t.designation.toLowerCase().includes(teacherQuery.trim().toLowerCase()) ||
        t.code?.toLowerCase().includes(teacherQuery.trim().toLowerCase()),
    )
    .sort((a: Teacher, b: Teacher) => {
      const aSuggested = a.id ? suggestedTeacherIds.includes(a.id) : false;
      const bSuggested = b.id ? suggestedTeacherIds.includes(b.id) : false;
      if (aSuggested && !bSuggested) return -1;
      if (!aSuggested && bSuggested) return 1;
      return 0;
    });

  const filteredStudents = studentQuery ? students.filter(
    (s: Student) =>
      (s.name.toLowerCase().includes(studentQuery.trim().toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentQuery.trim().toLowerCase())) &&
      !selectedStudents.some((selected: Student) => selected.studentId === s.studentId),
  ) : [];

  const handleAddStudentToList = (student: Student | null) => {
    if (!student) return;
    if (!selectedStudents.some((s: Student) => s.studentId === student.studentId)) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setStudentQuery("");
  };

  const handleRemoveStudentFromList = (studentId: string) => {
    setSelectedStudents(
      selectedStudents.filter((s: Student) => s.studentId !== studentId),
    );
  };

  const handleGenerateBulk = async () => {
    if ( !title || !selectedCourse || !selectedTeacher || selectedStudents.length === 0) {
      setMessage("Please fill in all required fields before generating PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    if (isGroupFrontPage) {
      const data = {
        id: `group-${selectedCourse.code}`,
        title,
        date,
        course: selectedCourse,
        teacher: selectedTeacher,
        isGroup: true,
        groupTitle,
        students: selectedStudents,
        student: {
          id: "",
          name: "",
          batch: "",
          section: "",
          dept: "",
        },
      };

      if (type === "assignment") {
        generateAssignment(data, doc);
      } else {
        generateLabReport(data, doc);
      }
    } else {
      selectedStudents.forEach((student: Student, index: number) => {
        const data = {
          id: `bulk-${student.studentId}`,
          title,
          date,
          course: selectedCourse,
          teacher: selectedTeacher,
          student: {
            id: student.studentId,
            name: student.name,
            batch: student.batch,
            section: student.section,
            dept: student.dept,
          },
        };

        if (index > 0) {
          doc.addPage();
        }

        if (type === "assignment") {
          generateAssignment(data, doc);
        } else {
          generateLabReport(data, doc);
        }
      });
    }

    // Update usage cache
    if (selectedCourse.id && selectedTeacher.id) {
      updateCourseTeacherUsage(selectedCourse.id, selectedTeacher.id);
    }

    const shortIds = selectedStudents.map((s) => s.studentId.slice(-3)).join("_");
    doc.save(
      `${selectedCourse.code}_(${shortIds})_${isGroupFrontPage ? "Group" : "Bulk"}_${type === "assignment" ? "Assignment" : "LabReport"}.pdf`,
    );
  };

  const handleShareWhatsapp = async () => {
    if (!title || !selectedCourse || !selectedTeacher || selectedStudents.length === 0) {
      setMessage("Please fill in all required fields before sharing.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const shareId = await shareFrontPage();
      const shareUrl = `${window.location.origin}/frontpage/share/${shareId}`;
      const text = `Hey! I've prepared the front pages for ${selectedCourse.code}, Student ID(s): ${selectedStudents.map(s => s.studentId).join(", ")}. You can download and edit here: ${shareUrl}`;
      
      // Update usage cache
      if (selectedCourse.id && selectedTeacher.id) {
        updateCourseTeacherUsage(selectedCourse.id, selectedTeacher.id);
      }
      
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    } catch (error) {
      console.error(error);
      alert("Failed to create share link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCourse = async () => {
    if (!newCourse.code || !newCourse.title) return;
    setIsSubmitting(true);
    try {
      const courseData = {
        code: newCourse.code,
        title: newCourse.title,
        keywords: newCourse.keywords || "",
      };

      if (newCourse.id) {
        await updateCourse(newCourse.id, courseData);
      } else {
        const added = await addCourse(courseData);
        setCourse(added);
      }
      setIsCourseModalOpen(false);
      setNewCourse({ code: "", title: "", keywords: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitTeacher = async () => {
    if (!newTeacher.name || !newTeacher.faculty || !newTeacher.designation)
      return;

    setIsSubmitting(true);
    try {
      const refinedFaculty = refineDepartmentName(newTeacher.faculty);
      const teacherData = {
        code: newTeacher.code,
        name: newTeacher.name,
        faculty: refinedFaculty,
        designation: newTeacher.designation,
      };

      if (newTeacher.id) {
        await updateTeacher(newTeacher.id, teacherData);
      } else {
        const added = await addTeacher(teacherData);
        setTeacher(added);
      }
      setIsTeacherModalOpen(false);
      setNewTeacher({ code: "", name: "", faculty: "", designation: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStudent = async () => {
    if (
      !newStudent.name ||
      !newStudent.studentId ||
      !newStudent.batch ||
      !newStudent.section ||
      !newStudent.dept
    )
      return;

    setIsSubmitting(true);
    try {
      const refinedDept = refineDepartmentName(newStudent.dept);
      const studentData = {
        name: newStudent.name,
        studentId: newStudent.studentId,
        batch: newStudent.batch,
        section: newStudent.section.toUpperCase(),
        dept: refinedDept,
      };

      if (newStudent.id) {
        await updateStudent(newStudent.id, studentData);
      } else {
        const added = await addStudent(studentData);
        // Automatically add the new student to the selected list
        handleAddStudentToList(added);
      }
      setIsStudentModalOpen(false);
      setNewStudent({
        studentId: "",
        name: "",
        batch: "",
        section: "",
        dept: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-10 w-64 rounded-full" />
        </div>

        <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="p-1 bg-zinc-700 rounded-xl flex w-full gap-1">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-6 space-y-8 bg-zinc-900">
      <div className="space-y-4">
        <h4 className="text-2xl text-center text-white font-semibold mb-4">Frontpage Generator</h4>

        {/* Type Selection */}
        <div className="p-1 bg-zinc-800 rounded-xl inline-flex w-full">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              type === "assignment"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
            onClick={() => setType("assignment")}
          >
            Assignment
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              type === "labReport"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
            onClick={() => setType("labReport")}
          >
            Lab Report
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Title</label>
            <Input
              placeholder={
                type === "assignment" ? "Assignment Title" : "Experiment Name"
              }
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Date</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  onClick={() => setDate(new Date())}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  onClick={() =>
                    setDate(
                      new Date(new Date().setDate(new Date().getDate() + 1)),
                    )
                  }
                >
                  Tomorrow
                </button>
              </div>
            </div>
            <Input
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
        </div>

        {/* Autocomplete Fields */}
        <div className="space-y-4">
          <Autocomplete
            label="Course"
            placeholder="Search by course code or title..."
            items={filteredCourses}
            onSearch={setCourseQuery}
            onSelect={setCourse}
            onEdit={handleEditCourse}
            selectedItem={selectedCourse || undefined}
            onCreateNew={() => {
              setNewCourse({ code: "", title: "" });
              setIsCourseModalOpen(true);
            }}
            value={
              selectedCourse
                ? `${selectedCourse.code} - ${selectedCourse.title}`
                : ""
            }
            renderItem={(item) => (
              <div>
                <span className="font-medium">{item.code}</span>
                <span className="text-zinc-500 mx-2">-</span>
                <span>{item.title}</span>
              </div>
            )}
          />

          <Autocomplete
            label="Teacher"
            placeholder="Search by teacher code or name..."
            items={filteredTeachers}
            onSearch={setTeacherQuery}
            onSelect={setTeacher}
            onEdit={handleEditTeacher}
            selectedItem={selectedTeacher || undefined}
            onCreateNew={() => {
              setNewTeacher({
                code: "",
                name: "",
                faculty: "",
                designation: "",
              });
              setIsTeacherModalOpen(true);
            }}
            value={
              selectedTeacher
                ? `${selectedTeacher.name} (${selectedTeacher.designation})`
                : ""
            }
            renderItem={(item) => (
              <div className="flex justify-start items-center w-full">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {item.name}{" "}
                    {item.code && (
                      <span className="text-zinc-400 font-normal ml-1">
                        ({item.code})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">
                    {item.designation}, {item.faculty}
                  </div>
                </div>
                {item.id && suggestedTeacherIds.includes(item.id) && (
                  <span className="shrink-0 ml-2 bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-green-400">
                    Suggested
                  </span>
                )}
              </div>
            )}
          />
        </div>

        {/* Selected Students List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Users className="h-4 w-4" />
            Selected Students ({selectedStudents.length})
          </div>

          {selectedStudents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-100">
              {selectedStudents.map((student: Student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-3 bg-green-900/30 border border-green-700 rounded-xl"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">
                      {student.name}
                    </div>
                    <div className="text-xs">
                      {student.studentId} ({student.batch} - {student.section})
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleEditStudent(student)
                      }
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium mr-4"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() =>
                        handleRemoveStudentFromList(student.studentId)
                      }
                      className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Autocomplete
          label="Students"
          placeholder="Search by short ID/ Name and click to add..."
          items={filteredStudents}
          onSearch={setStudentQuery}
          onSelect={handleAddStudentToList}
          onEdit={handleEditStudent}
          onCreateNew={() => {
            setNewStudent({
              studentId: "",
              name: "",
              batch: "",
              section: "",
              dept: "",
            });
            setIsStudentModalOpen(true);
          }}
          value={studentQuery}
          renderItem={(item) => (
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-zinc-500">
                ID: {item.studentId} | Batch: {item.batch} | Sec: {item.section}
              </div>
            </div>
          )}
        />

        {/* Group Selection */}
        <div className="flex flex-wrap gap-4 items-center py-2 text-zinc-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frontpageMode"
              checked={!isGroupFrontPage}
              onChange={() => setIsGroupFrontPage(false)}
              className="w-4 h-4 text-black border-zinc-300 focus:ring-black"
            />
            <span className="text-sm font-medium">{selectedStudents.length >0 ? `${selectedStudents.length}` : null} Individual Frontpages</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frontpageMode"
              checked={isGroupFrontPage}
              onChange={() => setIsGroupFrontPage(true)}
              className="w-4 h-4 text-black border-zinc-300 focus:ring-black"
            />
            <span className="text-sm font-medium">1 Group Frontpage</span>
          </label>
        </div>

        {isGroupFrontPage && (
          <div className="space-y-1 pb-2">
            <label className="text-sm font-medium text-zinc-300">Group Name / Number</label>
            <Input
              placeholder="e.g. Group A / The Innovators"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
          </div>
        )}

        <p id="message" className="text-xs text-red-500">{message}</p>

        <div className="flex gap-4">          
          <Button
            variant="success"
            className="px-4 py-3 text-lg"
            onClick={handleShareWhatsapp}
            disabled={isSubmitting || !selectedCourse || !selectedTeacher || selectedStudents.length === 0}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5 mr-1" />}
            Share to WhatsApp
          </Button>

          <Button
            className="px-4 py-3 text-lg"
            onClick={handleGenerateBulk}
            disabled={
              !title ||
              !selectedCourse ||
              !selectedTeacher ||
              selectedStudents.length === 0
            }
          >
            Download{" "}
            {isGroupFrontPage ? "Group PDF" : (selectedStudents.length > 0 ? `${selectedStudents.length} Pages` : "PDF")}
          </Button>
        </div>
      </div>

      {/* Modals (Copy from FrontPageForm) */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {newCourse.id ? "Edit Course" : "Add New Course"}
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Course Code</label>
            <Input
              value={newCourse.code}
              onChange={(e) =>
                setNewCourse({ ...newCourse, code: e.target.value })
              }
              placeholder="e.g. CSE-101"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Course Title</label>
            <Input
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              placeholder="e.g. Introduction to Programming"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Keywords (Optional)</label>
            <Input
              value={newCourse.keywords}
              onChange={(e) =>
                setNewCourse({ ...newCourse, keywords: e.target.value })
              }
              placeholder="e.g. flutter, dart, mobile development"
            />
            <p className="text-xs text-zinc-500">Keywords to help find this course more easily.</p>
          </div>
          <Button
            className="w-full"
            onClick={submitCourse}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {newCourse.id ? "Update Course" : "Save Course"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {newTeacher.id ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Teacher Code (Optional)
            </label>
            <Input
              value={newTeacher.code}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().slice(0, 3);
                setNewTeacher({ ...newTeacher, code: val });
              }}
              placeholder="e.g. SAR"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Designation</label>
            <Input
              value={newTeacher.designation}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, designation: e.target.value })
              }
              placeholder="e.g. Lecturer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Faculty / Department</label>
            <Input
              value={newTeacher.faculty}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, faculty: e.target.value })
              }
              placeholder="e.g. CSE"
            />
          </div>
          <Button
            className="w-full"
            onClick={submitTeacher}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {newTeacher.id ? "Update Teacher" : "Save Teacher"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {newStudent.id ? "Edit Student" : "Add New Student"}
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Student ID</label>
            <Input
              value={newStudent.studentId}
              onChange={(e) =>
                setNewStudent({ ...newStudent, studentId: e.target.value })
              }
              placeholder="e.g. 182202001"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <Input
                value={newStudent.batch}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, batch: e.target.value })
                }
                placeholder="e.g. 52"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Input
                value={newStudent.section}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, section: e.target.value.toUpperCase() })
                }
                placeholder="e.g. B"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Input
              value={newStudent.dept}
              onChange={(e) =>
                setNewStudent({ ...newStudent, dept: e.target.value })
              }
              placeholder="e.g. CSE"
            />
          </div>
          <Button
            className="w-full"
            onClick={submitStudent}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {newStudent.id ? "Update Student" : "Save Student"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
