import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import { is } from "cheerio/dist/commonjs/api/traversing";
import checkArrayType from "./checkArrayType";

export default async function downloadAndParseSheet(
  spreadsheetId: string,
  sheetName: string
): Promise<Record<string, any>[]> {
  const csvUrl = `https://docs.google.com/spreadsheets/u/2/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

  // Fetch CSV as text
  const res = await fetch(csvUrl);
  const csvText = await res.text();

  const parsed = csvText
    .split(/\r?\n/) // split lines
    .map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    )
    .filter((row) => row.filter((cell) => cell !== "").length >= 3);

  const schedules: Record<string, any>[] = [];

  const tables: {
    dates: string[];
    times: string[];
    weekDays: string[];
  }[] = [
    { dates: [], times: [], weekDays: [] },
    { dates: [], times: [], weekDays: [] },
  ];

  let tableIndex = 0;

  // build tables
  for (const row of parsed) {
    const type = checkArrayType(row);

    switch (type) {
      case "dates":
        tables[tableIndex].dates.push(
          ...row.slice(2).filter((cell) => cell !== "")
        );
        break;
      case "times":
        tables[tableIndex].times.push(
          ...row.slice(2).filter((cell) => cell !== "")
        );
        break;
      case "weekDays":
        tables[tableIndex].weekDays.push(
          ...row.slice(2).filter((cell) => cell !== "")
        );
        tableIndex++;
        break;
    }
  }

  // build schedules
  tableIndex = -1;

  for (const row of parsed) {
    const type = checkArrayType(row);

    if (type === "dates") {
      tableIndex++;
    }

    if (type === "courses") {
      const schedule = {
        batch: row[0],
        exams: [] as {
          subject: string;
          weekday: string;
          time: string;
          date: string;
        }[],
      };

      for (let j = 2; j < row.length; j++) {
        if (row[j]) {
          schedule.exams.push({
            subject: row[j],
            weekday: tables[tableIndex].weekDays[j - 2],
            time: tables[tableIndex].times[j - 2],
            date: tables[tableIndex].dates[j - 2],
          });
        }
      }

      schedules.push(schedule);
    }
  }

  console.log("Parsed data:", parsed, tables);

  return schedules;
}
