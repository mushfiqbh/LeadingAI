import axios from "axios";

export default async function callMCPServer(serverName: string, input: string) {
  try {
    if (serverName === "result") {
      const res = await axios.post("http://localhost:5000/mcp/result", {
        student_id: input,
      });

      return res.data;
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
