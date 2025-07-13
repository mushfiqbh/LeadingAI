import generateJsonFromSchedules from "./jsonExamSheet";
import parseExamSheet from "./parseExamSheet";
import { JsonScheduleOutput } from "./types";

export default async function fetchExamRoutineSheet(
  spreadsheetId: string
): Promise<JsonScheduleOutput | null> {
  const csvParser = async (spreadsheetId: string, sheetName: string) => {
    const csvUrl = `https://docs.google.com/spreadsheets/u/0/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    // Fetch CSV as text
    const res = await fetch(csvUrl);
    const csvText = await res.text();

    const parsed = csvText
      .split(/\r?\n/) // split lines
      .map((line) =>
        line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
      );

    return parsed;
  };

  // Fetch the CSV data from the Google Sheet
  const parsed = await csvParser(spreadsheetId, "Sheet1");

  // Parse the CSV data into structured schedules
  const schedules = parseExamSheet(parsed);

  // Generate JSON output from the parsed schedules
  const json_schedule = generateJsonFromSchedules(schedules);

  //   return json_schedule;
  return json_schedule;
}
