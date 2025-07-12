import PublicGoogleSheetsParser from "public-google-sheets-parser";
import downloadAndParseSheet from "./downloadAndParseSheet";

type Schedule = Record<string, any>;

export async function fetchClassRoutineSheet(
  spreadsheetId: string
): Promise<Schedule[]> {
  const parser = new PublicGoogleSheetsParser(spreadsheetId);
  const items = await parser.parse();

  if (!items || items.length === 0) {
    return [];
  }

  // Filter and clean the data
  const data = items
    .filter((item) => "Batch" in item && "Section" in item)
    .map((item) => {
      const cleaned: Schedule = {};
      for (const [key, value] of Object.entries(item)) {
        if (
          typeof value === "string" &&
          value.length === 1 &&
          key !== "Section"
        )
          continue;
        cleaned[key] = value;
      }
      return cleaned;
    });

  return data;
}

export async function fetchExamRoutineSheet(
  spreadsheetId: string
): Promise<Schedule[]> {
  const items = await downloadAndParseSheet(spreadsheetId, "Sheet1");

  if (!items || items.length === 0) {
    return [];
  }

  // Filter and clean the data
  const data = items.map((item) => {
    const cleaned: Schedule = {};
    for (const [key, value] of Object.entries(item)) {
      cleaned[key] = value;
    }
    return cleaned;
  });

  return data;
}
