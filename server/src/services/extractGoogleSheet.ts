import fetchClassRoutineSheet from "./class-sheet/fetchClassSheet";
import fetchExamRoutineSheet from "./exam-sheet/fetchExamSheet";
``
export default async function extractGoogleSheet(
  url: string,
  category: string
) {
  try {
    // Extract the spreadsheet ID from the URL
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid Google Sheets URL");
    }
    const spreadsheetId = match[1];

    const data = await fetchExamRoutineSheet(spreadsheetId);

    if (!data) {
      throw new Error("No data found in the Google Sheet");
    }

    return data;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    throw new Error("Failed to extract data from Google Sheets.");
  }
}
