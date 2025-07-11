import fetchSheetData from "../utils/fetchGoogleSheet";

type Schedule = Record<string, any>;

function filterSchedules(data: Schedule[]): Schedule[] {
  return data
    .filter((item) => "Batch" in item && "Section" in item)
    .map((item) => {
      const cleaned: Schedule = {};
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === "string" && value.length === 1) continue;
        cleaned[key] = value;
      }
      return cleaned;
    });
}

export default async function extractGoogleSheet(url: string): Promise<string> {
  try {
    const data = await fetchSheetData(url);
    if (!data || data.length === 0) {
      throw new Error("No data found in the Google Sheet");
    }
    const cleanedData = filterSchedules(data);
    const content = JSON.stringify(cleanedData, null, 2);

    return content;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    throw new Error("Failed to extract data from Google Sheets.");
  }
}
