import "dotenv/config";
import { supabase } from "../services/supabaseClient";

async function checkDb() {
  const { data, error } = await supabase.from("documents").select("*");
  if (error) {
    console.error("Error fetching documents:", error);
  } else {
    console.log("Documents in DB:", JSON.stringify(data, null, 2));
  }
}

checkDb();
