export default function refineDepartmentName(department: string): string {
  const dept = department.toLowerCase();

  // Computer Science and Engineering
  if (dept.includes("cs") || dept.includes("computer")) {
    return "Computer Science and Engineering";
  }

  // Electrical and Electronic Engineering
  if (dept.includes("eee") || dept.includes("electrical")) {
    return "Electrical and Electronic Engineering";
  }

  // Civil Engineering
  if (dept.includes("ce") || dept.includes("civil")) {
    return "Civil Engineering";
  }

  // Architecture
  if (dept.includes("arch")) {
    return "Architecture";
  }

  // Business Administration
  if (
    dept.includes("bba") ||
    dept.includes("mba") ||
    dept.includes("business")
  ) {
    if (dept.includes("executive")) {
      return "MBA (Executive)";
    } else if (dept.includes("mba")) {
      return "MBA (Regular)";
    }
    return "BBA (Hons)";
  }

  // Tourism & Hospitality Management
  if (
    dept.includes("thm") ||
    dept.includes("tourism") ||
    dept.includes("hospitality")
  ) {
    return "Tourism & Hospitality Management";
  }

  // English
  if (dept.includes("eng")) {
    if (dept.includes("m.a") || dept.includes("master")) {
      return "M.A. in English";
    }
    return "B.A. (Hons) in English";
  }

  // Islamic Studies
  if (dept.includes("islamic")) {
    if (dept.includes("m.a") || dept.includes("master")) {
      return "M.A. in Islamic Studies";
    }
    return "B.A. (Hons) in Islamic Studies";
  }

  // Law
  if (dept.includes("law") || dept.includes("llb") || dept.includes("llm")) {
    if (dept.includes("llm") || dept.includes("master")) {
      return "LLM";
    }
    return "LLB (Hons)";
  }

  // Bangla
  if (
    dept.includes("ba") ||
    dept.includes("bangla") ||
    dept.includes("bengali")
  ) {
    return "B.A. (Hons) in Bangla";
  }

  // Public Health
  if (dept.includes("public health") || dept.includes("mph")) {
    return "Master of Public Health (MPH)";
  }

  return department;
}
