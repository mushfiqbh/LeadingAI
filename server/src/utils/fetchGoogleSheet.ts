import PublicGoogleSheetsParser from "public-google-sheets-parser";

export default async function fetchSheetData(
  url: string
): Promise<Record<string, any>[]> {
  // Extract the spreadsheet ID from the URL
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error("Invalid Google Sheets URL");
  }
  const spreadsheetId = match[1];
  const parser = new PublicGoogleSheetsParser(spreadsheetId);

  const items = await parser.parse();

  if (!items || items.length === 0) {
    return [];
  }

  return items;
}
