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
  doc.setTextColor("purple");
  doc.text(data.title, pageWidth / 2, 100, "center"); // lab report title

  // Course Information Table
  const yPosition = 110; // Starting position for table
  const rowHeight = 7; // Adjust row height as needed

  const courseInfo = [
    ["Course Code", data.course.code],
    ["Course Title", data.course.title],
  ];
  let courseInfoEnd = courseInfo.length;

  doc.setFontSize(12);
  doc.setTextColor("black");
  let inc = 0;

  courseInfo.forEach((row, index) => {
    const y = yPosition + (index + 1 + inc) * rowHeight;

    const wrappedText = doc.splitTextToSize(row[1], 100);
    courseInfoEnd += wrappedText.length - 1;

    if (row[0] == "Course Title" && wrappedText.length > 1) {
      inc = 1;
    }

    doc.setFont("Times New Roman", "normal");
    wrappedText.forEach((line: string, lineIndex: number) => {
      doc.text(line, 100, y + lineIndex * rowHeight);
    });

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], 70, y);
  });

  // Submitted To Section
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("purple");
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
  doc.setTextColor("purple");
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

  doc.setFont("Times New Roman", "normal");
  doc.setTextColor("black");
  studentInfo.forEach((row, index) => {
    const y =
      yPosition +
      courseInfoEnd * rowHeight +
      3 * rowHeight +
      40 +
      (index + 1) * rowHeight;

    doc.setFont("Times New Roman", "bold");
    doc.text(row[0], 70, y + 10);

    doc.setFont("Times New Roman", "normal");
    doc.text(row[1], 100, y + 10);
  });

  // Submission Date
  doc.setFont("Times New Roman", "bold");
  doc.setTextColor("purple");
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
