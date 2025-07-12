type ArrayType = "dates" | "times" | "weekDays" | "courses" | "unknown";

export default function checkArrayType(array: string[]): ArrayType {
  const weekdays = [
    "friday",
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
  ];

  const cleaned = array.map((cell) =>
    cell.replace(/["']/g, "").trim().toLowerCase()
  );

  if (cleaned.some((cell) => /\d{2}\/\d{2}\/\d{2,4}}/.test(cell))) {
    return "dates";
  }

  if (cleaned.some((cell) => /\d{1,2}:\d{2}-\d{1,2}:\d{2}/.test(cell))) {
    return "times";
  }

  if (cleaned.some((cell) => weekdays.includes(cell))) {
    return "weekDays";
  }

  const first = cleaned[0];
  const second = cleaned[1];

  if (first && /^\d+$/.test(first) && second && /^[a-z]$/i.test(second)) {
    return "courses";
  }

  return "unknown";
}
