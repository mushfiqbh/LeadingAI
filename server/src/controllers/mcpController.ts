import axios from "axios";
import { Request, Response } from "express";

export const getResult = async (req: Request, res: Response): Promise<void> => {
  const { student_id } = req.body;

  if (!student_id) {
    res
      .status(400)
      .json({ success: false, message: "Missing student_id" });
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

    res.json({
      success: true,
      student_id,
      result,
    });
  } catch (error: any) {
    console.error("❌ Error fetching result:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch result from lus.ac.bd",
    });
  }
};
