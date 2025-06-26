import { ChatCompletionTool } from "openai/resources/index";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "call_mcp_server",
      description:
        "Call an MCP server to retrieve info like class schedules, weather or reminders.",
      parameters: {
        type: "object",
        properties: {
          server: {
            type: "string",
            description:
              "Name of the MCP server: e.g., timetable, weather, reminder",
          },
          input: {
            type: "string",
            description: "The input query to send to the MCP server",
          },
        },
        required: ["server", "input"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "call_mcp_server",
      description: "Call an MCP server to fetch student results by student ID",
      parameters: {
        type: "object",
        properties: {
          server: {
            type: "string",
            enum: ["result"],
          },
          input: {
            type: "string",
            description: "Student ID to fetch result for",
          },
        },
        required: ["server", "input"],
      },
    },
  },
];
