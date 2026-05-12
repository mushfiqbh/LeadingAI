import { Exam, RoutineOptions } from "../../types/types";
import { createCanvas, registerFont } from "canvas";
import { wrapText } from "./helperFunctions";
import refineDepartmentName from "../../utils/refineDepartmentName";

registerFont("./fonts/Arial-Regular.ttf", { family: "ArialRegular" });
registerFont("./fonts/Arial-Bold.ttf", { family: "ArialBold" });

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
  const tableColWidths = [200, 200, 200];
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
  ctx.font = "bold 26px ArialBold";
  ctx.textAlign = "center";
  ctx.fillText("LEADING UNIVERSITY", canvasWidth / 2, dynamicPadding + 30);

  // Department and batch info
  ctx.font = "bold 20px ArialBold";
  ctx.fillText(department, canvasWidth / 2, dynamicPadding + 60);
  ctx.fillStyle = "#4a5568";
  ctx.fillText(
    `Semester: ${semester}  Batch: ${batch}`,
    canvasWidth / 2,
    dynamicPadding + 90
  );

  // Table start position
  const startX = padding;
  let y = dynamicPadding + headerHeight;

  // Table Header
  ctx.font = "bold 18px ArialBold";
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
  ctx.font = "20px ArialRegular";

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

    // Date column - vertically centered
    const dateTextHeight = 32; // Height for date + weekday (16px each + gap)
    const dateCenterY = y + (rowHeight - dateTextHeight) / 2;

    ctx.font = "20px ArialRegular";
    ctx.fillText(
      exam.date || "TBD",
      startX + tableColWidths[0] / 2,
      dateCenterY + 16
    );

    // Weekday column (below date)
    ctx.font = "18px ArialRegular";
    ctx.globalAlpha = 0.6;
    ctx.fillText(
      exam.weekday ? exam.weekday : "",
      startX + tableColWidths[0] / 2,
      dateCenterY + 36
    );
    ctx.globalAlpha = 1.0;

    // Course column - vertically centered
    ctx.font = "20px ArialRegular";
    const courseCenterY = y + rowHeight / 2 + 8;
    wrapText(
      ctx,
      exam.course,
      startX + tableColWidths[0] + tableColWidths[1] / 2,
      courseCenterY,
      16,
      "20px ArialRegular"
    );

    // Time & Shift column
    const timeTextHeight = 32;
    const timeCenterY = y + (rowHeight - timeTextHeight) / 2;
    ctx.font = "20px ArialRegular";
    ctx.fillText(
      exam.time || "TBD",
      startX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] / 2,
      timeCenterY + 16
    );

    // Shift (below time)
    ctx.font = "18px ArialRegular";
    ctx.globalAlpha = 0.6;
    ctx.fillText(
      exam.shift ? exam.shift : "",
      startX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] / 2,
      timeCenterY + 36
    );
    ctx.globalAlpha = 1.0;
  });

  // Signature section
  const signatureY = canvasHeight - dynamicPadding - 10;
  ctx.font = "16px ArialBold";
  ctx.fillStyle = "#666666";
  ctx.textAlign = "right";
  ctx.fillText("Generated by LeadingAI", canvasWidth - padding, signatureY);

  const buffer = canvas.toBuffer("image/png");
  return buffer;
}
