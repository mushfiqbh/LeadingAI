import { Exam, RoutineOptions } from "../../types/types";
import { createCanvas } from "canvas";
import { wrapText } from "./helperFunctions";
import refineDepartmentName from "../../utils/refineDepartmentName";

export default function examRoutineImageCreator({
  department,
  semester,
  batch,
  timeSlots,
  weeklySchedule,
}: Omit<RoutineOptions, "section"> & {
  weeklySchedule: Exam[];
}) {
  department = refineDepartmentName(department);

  if (timeSlots[0].includes("-")) {
    timeSlots.map((slot, index) => {
      const [start, end] = slot.split("-");
      timeSlots[index] = `${start.trim()}- ${end.trim()}`;
    });
  }
  const padding = 60;
  const tableColWidths = [200, 200, 200]; // Date, Course, Time & Shift
  const rowHeight = 70;
  const tableWidth = tableColWidths.reduce((a, b) => a + b, 0);

  // Calculate total number of exams for table height
  const totalExams = weeklySchedule.length;
  const tableHeight = rowHeight * (totalExams + 1); // +1 for header

  const canvasWidth = tableWidth + padding * 2;
  const canvasHeight = canvasWidth; // 1:1 aspect ratio (square)

  // Calculate dynamic vertical padding to center content
  const headerHeight = 120; // Space for university name, department, and batch info
  const signatureHeight = 40; // Space for signature
  const totalContentHeight = headerHeight + tableHeight + signatureHeight;
  const dynamicPadding = (canvasHeight - totalContentHeight) / 2;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Background with soft cream color
  ctx.fillStyle = "#faf9f7";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Header text in dark gray
  ctx.fillStyle = "#4a5568";
  ctx.font = "bold 26px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("LEADING UNIVERSITY", canvasWidth / 2, dynamicPadding + 30);

  // Department
  ctx.font = "20px Arial";
  ctx.fillText(department, canvasWidth / 2, dynamicPadding + 60);

  // Semester and Batch
  ctx.font = "bold 20px Arial";
  ctx.fillText(
    `Semester: ${semester}  Batch: ${batch}`,
    canvasWidth / 2,
    dynamicPadding + 90
  );

  // Table start position
  const startX = padding;
  let y = dynamicPadding + headerHeight;

  // Table Header
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  // Draw header cells
  ctx.strokeRect(startX, y, tableColWidths[0], rowHeight);
  ctx.strokeRect(startX + tableColWidths[0], y, tableColWidths[1], rowHeight);
  ctx.strokeRect(
    startX + tableColWidths[0] + tableColWidths[1],
    y,
    tableColWidths[2],
    rowHeight
  );

  ctx.fillText("Date", startX + tableColWidths[0] / 2, y + 45);
  ctx.fillText(
    "Course",
    startX + tableColWidths[0] + tableColWidths[1] / 2,
    y + 45
  );
  ctx.fillText(
    "Time & Shift",
    startX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] / 2,
    y + 45
  );

  // Rows
  ctx.font = "20px Arial";

  weeklySchedule.forEach((exam, idx) => {
    y += rowHeight;

    // Draw row borders
    ctx.strokeRect(startX, y, tableColWidths[0], rowHeight);
    ctx.strokeRect(startX + tableColWidths[0], y, tableColWidths[1], rowHeight);
    ctx.strokeRect(
      startX + tableColWidths[0] + tableColWidths[1],
      y,
      tableColWidths[2],
      rowHeight
    );

    // Date column
    ctx.fillText(exam.date || "TBD", startX + tableColWidths[0] / 2, y + 25);

    // Weekday column (below date) with opacity
    ctx.globalAlpha = 0.6;
    ctx.fillText(
      exam.weekday ? exam.weekday : "",
      startX + tableColWidths[0] / 2,
      y + 50
    );
    ctx.globalAlpha = 1.0;

    // Course column
    wrapText(
      ctx,
      exam.subject,
      startX + tableColWidths[0] + tableColWidths[1] / 2,
      y + 35,
      16,
      "20px Arial"
    );

    // Time & Shift column
    ctx.fillText(
      exam.time || "TBD",
      startX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] / 2,
      y + 25
    );

    // Shift (below time) with opacity
    ctx.globalAlpha = 0.6;
    ctx.fillText(
      exam.shift ? exam.shift : "",
      startX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] / 2,
      y + 52
    );
    ctx.globalAlpha = 1.0;
  });

  // Signature section
  const signatureY = canvasHeight - dynamicPadding - 10;
  ctx.font = "16px Brush Script MT, cursive";
  ctx.fillStyle = "#666666";
  ctx.textAlign = "right";
  ctx.fillText("Made by LeadingAI", canvasWidth - padding, signatureY);

  const buffer = canvas.toBuffer("image/png");
  return buffer;
}
