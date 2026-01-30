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
  const deptName = data.isGroup ? (data.students?.[0]?.dept || data.student.dept) : data.student.dept;
  doc.text(deptName, pageWidth / 2, 85, "center");

  const yPosition = 100;
  const rowHeight = 7;

  const courseInfo: [string, string][] = [
    ["Course Code:", data.course.code],
    ["Course Title:", data.course.title],
    ["Assignment Title:", data.title],
  ];

  doc.setFontSize(14);

  let courseInfoEnd = courseInfo.length;
  let extraLineOffset = 0;

  courseInfo.forEach((row, index) => {
    const y = yPosition + (index + 1 + extraLineOffset) * rowHeight;
    const wrappedText = doc.splitTextToSize(row[1], 100);

    courseInfoEnd += wrappedText.length - 1;

    if (row[0] === "Course Title:" && wrappedText.length > 1) {
      extraLineOffset = 1;
    }

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], 98, y, "right");

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

  if (data.isGroup) {
    // Group Title
    if (data.groupTitle) {
      doc.setFont("Times New Roman", "bold");
      doc.setFontSize(14);
      doc.setTextColor("#3c78d8");
      doc.text(data.groupTitle, pageWidth / 2, submittedByY + 12, "center");
    }

    doc.setTextColor("black");
    const startY = submittedByY + (data.groupTitle ? 20 : 10);
    const colWidths = [55, 40, 15, 17]; // Name, ID, Batch, Section
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = (pageWidth - tableWidth) / 2;
    const header = ["Name", "ID", "Batch", "Section"];

    // Draw Header
    doc.setFontSize(12);
    doc.setFont("Times New Roman", "bold");
    let currentX = startX;
    header.forEach((h, i) => {
      doc.rect(currentX, startY, colWidths[i], rowHeight);
      doc.text(h, currentX + 1, startY + 5);
      currentX += colWidths[i];
    });

    // Draw Rows
    doc.setFont("Times New Roman", "normal");
    data.students?.forEach((student, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;
      let x = startX;
      const studentData = [student.name, student.studentId, student.batch, student.section];

      studentData.forEach((val, colIndex) => {
        doc.rect(x, y, colWidths[colIndex], rowHeight);
        doc.text(String(val), x + 1, y + 5);
        x += colWidths[colIndex];
      });
    });

    const submissionDate = new Date(data.date)
      .toISOString()
      .split("T")[0]
      .replace(/\//g, "-");

    const tableBottom = startY + ((data.students?.length || 0) + 1) * rowHeight;
    doc.setFont("Times New Roman", "bold");
    doc.setFontSize(14);
    doc.text(
      `Submission Date: ${submissionDate}`,
      pageWidth / 2,
      tableBottom + 20,
      "center"
    );
  } else {
    const studentInfo: [string, string][] = [
      ["Name", data.student.name],
      ["ID", data.student.id],
      ["Batch", data.student.batch],
      ["Section", data.student.section],
    ];

    const tableWidth = 96;
    const labelWidth = 30;
    const tableStartX = (pageWidth - tableWidth) / 2;
    const tableTopY = submittedByY + 7;
    
    doc.setFont("Times New Roman", "normal");
    doc.setFontSize(12);
    doc.setTextColor("black");

    studentInfo.forEach((row, index) => {
      const y = tableTopY + (index + 1) * rowHeight - 2;
      const rowY = tableTopY + index * rowHeight;

      // Draw table cell borders
      doc.rect(tableStartX, rowY, tableWidth, rowHeight);
      doc.line(tableStartX + labelWidth, rowY, tableStartX + labelWidth, rowY + rowHeight);

      doc.setFont("Times New Roman", "bold");
      doc.text(row[0], tableStartX + 2, y);

      doc.setFont("Times New Roman", "normal");
      doc.text(row[1], tableStartX + labelWidth + 2, y);
    });

    const submissionDate = new Date(data.date)
      .toISOString()
      .split("T")[0]
      .replace(/\//g, "-");

    doc.setFont("Times New Roman", "bold");
    doc.setFontSize(14);
    doc.text(
      `Submission Date: ${submissionDate}`,
      pageWidth / 2,
      submittedByY +
        studentInfo.length * rowHeight +
        30,
      "center"
    );
  }

  if (!existingDoc) {
    doc.save(`A-${data.course.code}_${data.date} (${data.title}).pdf`);
  }
};

export default generateAssignment;