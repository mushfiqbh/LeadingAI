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
  doc.text("Leading University", pageWidth / 2, 75, "center");
  doc.setFontSize(20);
  doc.text(data.student.dept, pageWidth / 2, 85, "center");

  doc.setFont("Times New Roman", "bold");
  doc.setFontSize(16);
  doc.setTextColor("blue");
  doc.text(data.title, pageWidth / 2, 100, "center"); // lab report title

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
    "center"
  );
  doc.setTextColor("black");

  doc.text(
    data.teacher.name,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 35,
    "center"
  );

  doc.setFont("Times New Roman", "normal");
  doc.setTextColor("black");

  doc.text(
    data.teacher.designation,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 45,
    "center"
  );
  doc.text(
    "Department of " + data.teacher.faculty,
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 50,
    "center"
  );

  // Submitted By Section
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("gray");
  doc.text(
    "Submitted By",
    pageWidth / 2,
    yPosition + courseInfoEnd * rowHeight + 3 * rowHeight + 50,
    "center"
  );

  const studentInfo = [
    ["Name", data.student.name],
    ["ID", data.student.id],
    ["Batch", data.student.batch],
    ["Section", data.student.section],
  ];

  const submittedByTitleY = yPosition + courseInfoEnd * rowHeight + 3 * rowHeight + 50;
  const tableWidth = 80;
  const labelWidth = 30;
  const tableStartX = (pageWidth - tableWidth) / 2;
  const tableTopY = submittedByTitleY + 7;

  doc.setFont("Times New Roman", "normal");
  doc.setTextColor("black");
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

  // Submission Date
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("blue");
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
      70,
    "center"
  );

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
