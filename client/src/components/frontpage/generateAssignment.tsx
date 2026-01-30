import jsPDF from "jspdf";
import { FrontPageData } from "@/types/frontPage";

const generateAssignment = (data: FrontPageData, existingDoc?: jsPDF) => {
  const doc =
    existingDoc ||
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

  // Document metadata
  doc.setProperties({
    title: data.title,
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const imageURL =
    "https://i.ibb.co.com/cYMTmCT/Leading-University-Logo.png";
  doc.addImage(imageURL, "JPEG", (pageWidth - 40) / 2, 25, 40, 40);

  doc.setFont("Times New Roman", "normal");
  doc.setFontSize(24);
  doc.text("Leading University", pageWidth / 2, 75, "center");

  doc.setFontSize(20);
  doc.text(data.student.dept, pageWidth / 2, 85, "center");

  const yPosition = 100;
  const rowHeight = 7;

  const courseInfo: [string, string][] = [
    ["Course Code", data.course.code],
    ["Course Title", data.course.title],
    ["Assignment Title", data.title],
  ];

  doc.setFontSize(14);

  let courseInfoEnd = courseInfo.length;
  let extraLineOffset = 0;

  courseInfo.forEach((row, index) => {
    const y = yPosition + (index + 1 + extraLineOffset) * rowHeight;
    const wrappedText = doc.splitTextToSize(row[1], 100);

    courseInfoEnd += wrappedText.length - 1;

    if (row[0] === "Course Title" && wrappedText.length > 1) {
      extraLineOffset = 1;
    }

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], 60, y);

    doc.setFont("Times New Roman", "normal");
    wrappedText.forEach((line: string, lineIndex: number) => {
      doc.text(line, 100, y + lineIndex * rowHeight);
    });
  });

  const submittedToY =
    yPosition + courseInfoEnd * rowHeight + 25;

  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("gray");
  doc.text("Submitted To", pageWidth / 2, submittedToY, "center");
  doc.setTextColor("black");

  const teacherInfo: string[] = [
    data.teacher.name,
    data.teacher.designation,
    "Department of " + data.teacher.faculty,
  ];

  teacherInfo.forEach((info, index) => {
    const y = submittedToY + (index + 1) * rowHeight + 4;

    doc.text(info, pageWidth / 2, y, "center");
    doc.setFont("Times New Roman", "normal");
  });

  const submittedByY =
    submittedToY + teacherInfo.length * rowHeight + 25;

  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("gray");
  doc.text("Submitted By", pageWidth / 2, submittedByY, "center");
  doc.setTextColor("black");

  const studentInfo: [string, string][] = [
    ["Name", data.student.name],
    ["ID", data.student.id],
    ["Batch", data.student.batch],
    ["Section", data.student.section],
  ];

  const tableWidth = 80;
  const labelWidth = 30;
  const tableStartX = (pageWidth - tableWidth) / 2;
  const tableTopY = submittedByY + 7;

  studentInfo.forEach((row, index) => {
    const y = tableTopY + (index + 1) * rowHeight - 2;
    const rowY = tableTopY + index * rowHeight;

    // Draw table cell borders
    doc.rect(tableStartX, rowY, tableWidth, rowHeight);
    doc.line(tableStartX + labelWidth, rowY, tableStartX + labelWidth, rowY + rowHeight);

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], tableStartX + 5, y);

    doc.setFont("Times New Roman", "normal");
    doc.text(row[1], tableStartX + labelWidth + 5, y);
  });

  const submissionDate = new Date(data.date)
    .toISOString()
    .split("T")[0]
    .replace(/\//g, "-");

  doc.setFont("Times New Roman", "bold");
  doc.text(
    `Submission Date: ${submissionDate}`,
    pageWidth / 2,
    submittedByY +
      studentInfo.length * rowHeight +
      30,
    "center"
  );

  if (!existingDoc) {
    doc.save(`A-${data.course.code}_${data.date} (${data.title}).pdf`);
  }
};

export default generateAssignment;