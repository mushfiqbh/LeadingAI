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
            description: "The student ID of the student provided latest",
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
      name: "get_notice",
      description:
        "Retrieve recent university notices, bus schedules, announcements, updates, exam notices, holiday notifications, or any university information.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_links",
      description:
        "Retrieve Google drive shared folder links containing study materials, notes, pdfs.",
      parameters: {
        type: "object",
        properties: {},
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
          department: {
            type: "string",
            description: "The department for which to retrieve the routine.",
          },
          batch: {
            type: "number",
            description: "The batch for which to retrieve the routine.",
          },
          section: {
            type: "string",
            description:
              "The section for which to retrieve the routine, required for class routines. Not required for exam routines.",
          },
        },
        required: ["category", "department", "batch"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_google_sheet",
      description:
        "Update new Routine from Google Sheet URL to store in database",
      parameters: {
        type: "object",
        properties: {
          sheet_url: {
            type: "string",
            description: "The Google Sheet URL containing the new routine",
          },
          category: {
            type: "string",
            description:
              "The category of the routine (e.g., class-routine, exam-routine)",
            enum: ["class-routine", "exam-routine"],
          },
        },
        required: ["sheet_url", "category"],
      },
    },
  },
];
