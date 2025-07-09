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
        "Fetch recent university notices, bus schedules, announcements, updates, exam notices, holiday notifications, or any university information.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Category of notice to retrieve. Use 'bustime' for bus schedule, 'academic' for academic notices, 'event' for university events, or 'holiday' for holiday notifications.",
            enum: ["bustime", "academic", "general"],
          },
        },
        required: ["category"],
      },
    },
  },
];
