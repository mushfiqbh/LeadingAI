import jsPDF from "jspdf";
import { FrontPageData } from "../../types/types";

const generateAssignment = (data: FrontPageData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set document properties
  doc.setProperties({
    title: data.title,
  });

  // Add page content
  const pageWidth = doc.internal.pageSize.getWidth();

  // Leading University Logo
  const imageURL = "https://i.ibb.co.com/cYMTmCT/Leading-University-Logo.png";
  doc.addImage(imageURL, "JPEG", (pageWidth - 40) / 2, 25, 40, 40);

  // Title and Department
  doc.setFont("helvetica", "normal");
  doc.setFontSize(24);
  doc.text("Leading University", pageWidth / 2, 75, "center");
  doc.setFontSize(20);
  doc.text(data.student.dept, pageWidth / 2, 85, "center");

  // Course Information Table
  const yPosition = 100; // Starting position for table
  const rowHeight = 7; // Adjust row height as needed

  const courseInfo = [
    ["Course Code", data.course.code],
    ["Course Title", data.course.title],
    ["Assignment Title", data.title],
  ];
  let courseInfoEnd = courseInfo.length;

  doc.setFontSize(12);
  let inc = 0;

  courseInfo.forEach((row, index) => {
    const y = yPosition + (index + 1 + inc) * rowHeight;

    let wrappedText = doc.splitTextToSize(row[1], 100);
    courseInfoEnd += wrappedText.length - 1;

    if (row[0] == "Course Title" && wrappedText.length > 1) {
      inc = 1;
    }

    doc.setFont("helvetica", "normal");
    wrappedText.forEach((line: string, lineIndex: number) => {
      doc.text(line, 100, y + lineIndex * rowHeight);
    });

    doc.setFont("helvetica", "bold");
    doc.text(row[0], 60, y);
  });

  // Submitted To Section
  doc.setFont("helvetica", "bold");
  doc.text(
    "Submitted To",
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 25,
    "center"
  );

  const teacherInfo = [
    ["Name", data.teacher.name],
    ["Designation", data.teacher.designation],
    ["Faculty", "Dept. of " + data.teacher.faculty],
  ];

  teacherInfo.forEach((row, index) => {
    const y =
      yPosition + courseInfoEnd * rowHeight + 25 + (index + 1) * rowHeight;

    doc.setFont("helvetica", "bold");
    doc.text(row[0], 70, y);

    doc.setFont("helvetica", "normal");
    doc.text(row[1], 100, y);
  });

  // Submitted By Section
  doc.setFont("helvetica", "bold");
  doc.text(
    "Submitted By",
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + teacherInfo.length * rowHeight + 50,
    "center"
  );

  const studentInfo = [
    ["Name", data.student.name],
    ["Batch", data.student.batch],
    ["Section", data.student.section],
    ["ID", data.student.id],
  ];

  doc.setFont("helvetica", "normal");
  studentInfo.forEach((row, index) => {
    const y =
      yPosition +
      courseInfoEnd * rowHeight +
      teacherInfo.length * rowHeight +
      40 +
      (index + 1) * rowHeight;

    doc.setFont("helvetica", "bold");
    doc.text(row[0], 70, y + 10);

    doc.setFont("helvetica", "normal");
    doc.text(row[1], 100, y + 10);
  });

  // Submission Date
  doc.setFont("helvetica", "bold");
  const submissionDate = new Date(data.date)
    .toISOString()
    .split("T")[0]
    .replace(/\//g, "-");
  doc.text(
    `Submission Date: ${submissionDate}`,
    pageWidth / 2,
    yPosition +
      courseInfoEnd * rowHeight +
      teacherInfo.length * rowHeight +
      studentInfo.length * rowHeight +
      70,
    "center"
  );

  // Save the PDF
  doc.save(
    "A-" + data.course.code + "_" + data.date + " (" + data.title + ")" + ".pdf"
  );
};

export default generateAssignment;
