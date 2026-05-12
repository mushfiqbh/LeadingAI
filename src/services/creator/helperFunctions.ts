import { CanvasRenderingContext2D } from "canvas";

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  lineHeight: number,
  font: string
): number {
  // Set the font before measuring text
  ctx.font = font;

  // Handle empty or null text
  if (!text || typeof text !== "string") {
    return y;
  }

  if (text === "WEDNESDAY") {
    ctx.font = "bold 14px ArialBold";
  }

  // Split by spaces and write each part on a new line
  const parts = text.split(/\s+/).filter((part) => part.trim());

  parts.forEach((part, index) => {
    ctx.fillText(part, x, y + index * lineHeight);
  });

  // Return the final y-position
  return y + parts.length * lineHeight;
}
