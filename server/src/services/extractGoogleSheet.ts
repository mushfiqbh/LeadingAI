import {
  fetchClassRoutineSheet,
  fetchExamRoutineSheet,
} from "../utils/fetchGoogleSheet";

export default async function extractGoogleSheet(
  url: string,
  category: string
): Promise<string> {
  try {
    // Extract the spreadsheet ID from the URL
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid Google Sheets URL");
    }
    const spreadsheetId = match[1];

    const data =
      category === "class-routine"
        ? await fetchClassRoutineSheet(spreadsheetId)
        : await fetchExamRoutineSheet(spreadsheetId);

    if (!data || data.length === 0) {
      throw new Error("No data found in the Google Sheet");
    }

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    throw new Error("Failed to extract data from Google Sheets.");
  }
}
