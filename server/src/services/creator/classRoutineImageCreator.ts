import { createCanvas, registerFont } from "canvas";
import { wrapText } from "./helperFunctions";
import refineDepartmentName from "../../utils/refineDepartmentName";
import { RoutineOptions, WeeklyDaySchedule } from "../../types/types";

registerFont("./fonts/Arial-Regular.ttf", { family: "Arial" });
registerFont("./fonts/Lobster-Regular.ttf", { family: "Lobster" });

export default function classRoutineImageCreator({
  department,
  semester,
  batch,
  section,
  timeSlots,
  weeklySchedule,
}: RoutineOptions & { weeklySchedule: WeeklyDaySchedule[] }) {
  department = refineDepartmentName(department);

  if (timeSlots[0].includes("-")) {
    timeSlots.map((slot, index) => {
      const [start, end] = slot.split("-");
      timeSlots[index] = `${start.trim()}- ${end.trim()}`;
    });
  }

  const usedDayRoutines = weeklySchedule;
  const usedDays = usedDayRoutines.map((day) => day.day);

  const cellWidth = 92;
  const rowHeight = 90;
  const padding = 60;
  const tableWidth = cellWidth * (timeSlots.length + 1);

  const canvasWidth = tableWidth + padding * 2;
  const canvasHeight = canvasWidth; // 1:1 aspect ratio (square)

  // Calculate dynamic vertical padding to center content
  const headerHeight = 120; // Space for university name, department, and batch info
  const tableHeight = rowHeight * (usedDays.length + 1); // +1 for header row
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
  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";
  ctx.fillText("LEADING UNIVERSITY", canvasWidth / 2, dynamicPadding + 30);

  ctx.font = "20px Arial";
  ctx.fillText(department, canvasWidth / 2, dynamicPadding + 60);
  ctx.fillText(
    `Semester: ${semester}   Batch: ${batch}   Section: ${section}`,
    canvasWidth / 2,
    dynamicPadding + 90
  );

  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  // Soft gray border
  ctx.strokeStyle = "#a0aec0";

  let startX = padding;
  let startY = dynamicPadding + headerHeight;

  for (let i = 0; i <= usedDays.length; i++) {
    for (let j = 0; j <= timeSlots.length; j++) {
      const x = startX + j * cellWidth;
      const y = startY + i * rowHeight;

      // Add background colors
      if (i === 0 || j === 0) {
        // Header cells with soft blue-gray
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(x, y, cellWidth, rowHeight);
      } else if (i % 2 === 0) {
        // Alternating row colors - even rows with very light gray
        ctx.fillStyle = "#f7fafc";
        ctx.fillRect(x, y, cellWidth, rowHeight);
      } else {
        // Odd rows with white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, cellWidth, rowHeight);
      }

      ctx.strokeRect(x, y, cellWidth, rowHeight);
      ctx.textAlign = "center";

      // Set text color for headers
      ctx.fillStyle = i === 0 || j === 0 ? "#2d3748" : "#4a5568";

      if (i === 0 && j > 0) {
        // Calculate vertical center for time slots
        const timeSlotText = timeSlots[j - 1];
        const parts = timeSlotText.split(/\s+/).filter((part) => part.trim());
        const totalHeight = parts.length * 16;
        const centerY = y + (rowHeight - totalHeight) / 2 + 16;

        wrapText(
          ctx,
          timeSlotText,
          x + cellWidth / 2,
          centerY,
          16,
          "bold 14px Arial"
        );
      } else if (j === 0 && i > 0) {
        // Calculate vertical center for day names
        const dayText = usedDays[i - 1].toUpperCase();
        const parts = dayText.split(/\s+/).filter((part) => part.trim());
        const totalHeight = parts.length * 16;
        const centerY = y + (rowHeight - totalHeight) / 2 + 16;

        wrapText(
          ctx,
          dayText,
          x + cellWidth / 2,
          centerY,
          16,
          "bold 14px Arial"
        );
      }
    }
  }

  ctx.font = "13px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#4a5568"; // Consistent text color for content
  usedDayRoutines.forEach((dayRoutine) => {
    const row = usedDays.indexOf(dayRoutine.day);
    if (row === -1) return;

    dayRoutine.classes.forEach((cls) => {
      const col = cls.slot - 1;
      const x = startX + (col + 1) * cellWidth;
      const y = startY + (row + 1) * rowHeight;

      if (cls.course.toLowerCase() === "x") {
        ctx.fillText("X", x + cellWidth / 2, y + rowHeight / 2);
      } else {
        // Calculate number of parts to center the text block
        const parts = cls.course.split(/\s+/).filter((part) => part.trim());
        const lineHeightWithGap = 16;
        const totalHeight = parts.length * lineHeightWithGap;
        const startY = y + (rowHeight - totalHeight) / 2 + lineHeightWithGap;

        wrapText(ctx, cls.course, x + cellWidth / 2, startY, lineHeightWithGap);
      }
    });
  });

  // Add signature at the bottom
  const signatureY = startY + rowHeight * (usedDays.length + 1) + 30;
  ctx.font = "16px Lobster";
  ctx.fillStyle = "#666666";
  ctx.textAlign = "right";
  ctx.fillText("Made by LeadingAI", canvasWidth - padding, signatureY);

  const buffer = canvas.toBuffer("image/png");
  return buffer;
}
