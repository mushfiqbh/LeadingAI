import axios from "axios";
import { getResult } from "./mcpHandler";

export default async function callMCPServer(serverName: string, input: string) {
  try {
    if (serverName === "result") {
      const result = await getResult(input);
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
