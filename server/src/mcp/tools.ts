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
      name: "call_mcp_without_birthdate",
      description:
        "Call an MCP server to fetch student results, cgpa using only the student ID.",
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
  {
    type: "function",
    function: {
      name: "call_mcp_with_birthdate",
      description:
        "Call an MCP server to fetch coursewise and semesterwise results using student ID and birth date",
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
          input2: {
            type: "string",
            description: "Birth date in YYYY-MM-DD format",
          },
        },
        required: ["server", "input", "input2"],
      },
    },
  },
];
