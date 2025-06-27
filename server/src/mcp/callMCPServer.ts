import axios from "axios";
import { getResult } from "./resultMCP";

export default async function callMCPServer(
  serverName: string,
  input: string,
  input2?: string | undefined
) {
  try {
    if (serverName === "result") {
      const result = await getResult(input, input2);
      return result;
    }

    const response = await axios.post(
      `http://localhost:5000/mcp/${serverName}`,
      { input }
    );
    return response.data;
  } catch (error) {
    console.error("[MCP ERROR]", error);
    return {
      serverName,
      input,
      output: "❌ MCP server failed to respond.",
    };
  }
}
