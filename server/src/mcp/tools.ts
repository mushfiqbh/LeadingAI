import { ChatCompletionTool } from "openai/resources/index";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_result",
      description:
        "Retrieve academic result data for a student by ID, with optional birthday for full result access.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "The unique student ID of the student",
          },
          birthday: {
            type: "string",
            format: "date",
            description:
              "The student's date of birth (YYYY-MM-DD) for full access",
          },
        },
        required: ["student_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_university_notice",
      description:
        "Fetch recent or upcoming university notices, bus schedule, announcements, or updates. Provides summaries and guidance on where to verify official information.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Optional filter for the type of notice (e.g., 'academic', 'bus-schedule', 'events', 'exams', 'holidays').",
          },
          date: {
            type: "string",
            format: "date",
            description:
              "Optional filter for notices on or after a specific date (YYYY-MM-DD).",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "return_notice_text",
      description:
        "Extract all text from an image and return a relevant title and full content.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description:
              "A short, meaningful title extracted or derived from the image content.",
          },
          information: {
            type: "string",
            description:
              "All the text content extracted from the image without missing anything.",
          },
        },
        required: ["title", "information"],
      },
    },
  },
];
