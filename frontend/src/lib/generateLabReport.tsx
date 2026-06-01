import jsPDF from "jspdf";
import { FrontPageData } from "@/types/frontPage";

const generateLabReport = (data: FrontPageData, existingDoc?: jsPDF) => {
  const doc =
    existingDoc ||
    new jsPDF({
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
  doc.setFont("Times New Roman", "normal");
  doc.setFontSize(24);
  doc.text("Leading University", pageWidth / 2, 75, { align: "center" });
  doc.setFontSize(20);
  const deptName = data.isGroup ? (data.students?.[0]?.dept || data.student.dept) : data.student.dept;
  doc.text(deptName, pageWidth / 2, 85, { align: "center" });

  doc.setFont("Times New Roman", "bold");
  doc.setFontSize(16);
  doc.setTextColor("#3c78d8");
  doc.text(data.title, pageWidth / 2, 100, { align: "center" }); // lab report title

  // Course Information Table
  const yPosition = 110; // Starting position for table
  const rowHeight = 7; // Adjust row height as needed

  const courseInfo = [
    ["Course Code:", data.course.code],
    [" Course Title:", data.course.title],
  ];
  let courseInfoEnd = courseInfo.length;

  doc.setFontSize(14);
  doc.setTextColor("black");
  let inc = 0;

  courseInfo.forEach((row, index) => {
    const y = yPosition + (index + 1 + inc) * rowHeight;

    const wrappedText = doc.splitTextToSize(row[1], 100);
    courseInfoEnd += wrappedText.length - 1;

    if (row[0] == " Course Title:" && wrappedText.length > 1) {
      inc = 1;
    }

    doc.setFont("Times New Roman", "normal");
    wrappedText.forEach((line: string, lineIndex: number) => {
      doc.text(line, 102, y + lineIndex * rowHeight);
    });

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], 72, y);
  });

  // Submitted To Section
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("gray");
  doc.text(
    "Submitted To",
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 25,
    { align: "center" }
  );
  doc.setTextColor("black");

  doc.text(
    data.teacher.name,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 35,
    { align: "center" }
  );

  doc.setFont("Times New Roman", "normal");
  doc.setTextColor("black");

  doc.text(
    data.teacher.designation,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 43,
    { align: "center" }
  );
  doc.text(
    "Department of " + data.teacher.faculty,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 50,
    { align: "center" }
  );

  // Submitted By Section
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("gray");
  doc.text(
    "Submitted By",
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 3 * rowHeight + 50,
    { align: "center" }
  );

  const studentInfo = [
    ["", data.student.name],
    ["ID:", data.student.id],
    ["Batch:", data.student.batch],
    ["Section:", data.student.section],
  ];

  const submittedByTitleY = yPosition + courseInfoEnd * rowHeight + 3 * rowHeight + 50;

  let groupTitleOffset = 0;
  if (data.groupTitle) {
    doc.setFont("Times New Roman", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#3c78d8");
    doc.text(data.groupTitle, pageWidth / 2, submittedByTitleY + 12, { align: "center" });
    groupTitleOffset = 10;
  }

  if (data.isGroup) {
    doc.setTextColor("#3c78d8");

    doc.setTextColor("black");
    const startY = submittedByTitleY + (data.groupTitle ? 15 : 10);
    const colWidths = [55, 40, 15, 17]; // Name, ID, Batch, Section
    const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = (pageWidth - totalTableWidth) / 2;
    const header = ["Name", "ID", "Batch", "Section"];

    // Draw Header
    doc.setFontSize(12);
    doc.setFont("Times New Roman", "bold");
    let currentX = startX;
    header.forEach((h, i) => {
      doc.rect(currentX, startY, colWidths[i], rowHeight);
      doc.text(h, currentX + 2, startY + 5);
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
        doc.text(String(val), x + 2, y + 5);
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
    doc.setTextColor("#3c78d8");
    doc.text(
      `Submission Date: ${submissionDate}`,
      pageWidth / 2,
      tableBottom + 20,
      { align: "center" }
    );
  } else {
    const tableTopY = submittedByTitleY + 7 + groupTitleOffset;

    doc.setFont("Times New Roman", "normal");
    doc.setTextColor("black");

    studentInfo.forEach((row, index) => {
      const y = tableTopY + (index + 1) * rowHeight - 2;
      const combinedText = `${row[0]} ${row[1]}`;

      doc.setFont("Times New Roman", "bold");
      const labelWidth = doc.getTextWidth(row[0] + " ");
      const totalWidth = doc.getTextWidth(combinedText);
      const startX = (pageWidth - totalWidth) / 2;

      doc.text(row[0], startX, y);
      doc.setFont("Times New Roman", "normal");

      if(index === 0) {
        doc.setFontSize(15);
      }
      doc.text(row[1], startX + labelWidth, y);      
      doc.setFontSize(14);
    });

    // Submission Date
    doc.setFont("Times New Roman", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#3c78d8");
    const submissionDate = new Date(data.date)
    .toISOString()
    .split("T")[0]
    .replace(/\//g, "-");
    doc.text(
      `Submission Date: ${submissionDate}`,
      pageWidth / 2,
      yPosition +
        courseInfoEnd * rowHeight +
        3 * rowHeight +
        studentInfo.length * rowHeight +
        80,
      { align: "center" }
    );
  }

  if (!existingDoc) {
    // Save the PDF
    doc.save(
      "LR-" +
        data.course.code +
        "_" +
        data.date +
        " (" +
        data.title +
        ")" +
        ".pdf"
    );
  }
};

export default generateLabReport;
