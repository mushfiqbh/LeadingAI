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
              "Category of notice to retrieve. Use 'bus-schedule' for bus schedule, 'general' for other notifications.",
            enum: ["bus-schedule", "general"],
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_routine",
      description:
        "Retrieve the latest routine for a specific category, such as 'exam' or 'class'.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Category of routine to retrieve, such as 'exam-routine' or 'class-routine'.",
            enum: ["exam-routine", "class-routine"],
          },
          batch: {
            type: "string",
            description: "The batch for which to retrieve the routine.",
          },
          section: {
            type: "string",
            description:
              "The section for which to retrieve the routine, required for class routines. Not required for exam routines.",
          },
        },
        required: ["category", "batch"],
      },
    },
  },
];
