import axios from "axios";

export const getResult = async (student_id: string) => {
  if (!student_id) {
    return { success: false, message: "Missing student_id" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("action", "get-result");
    formData.append("student_id", student_id);

    const response = await axios.post(
      "https://www.lus.ac.bd/wp-admin/admin-ajax.php",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const result = response.data;

    return {
      success: true,
      student_id,
      result,
    };
  } catch (error: any) {
    console.error("❌ Error fetching result:", error.message);
    return {
      success: false,
      message: "Failed to fetch result from lus.ac.bd",
    };
  }
};
