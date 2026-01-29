"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";

// PASTE YOUR COURSES DATA HERE
const coursesToImport = [
  { code: "CSE-101", title: "Introduction to Computer Science", keywords: "cs101, intro" },
];

export default function BulkImportPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleImport = async () => {
    if (!confirm(`Are you sure you want to import ${coursesToImport.length} courses?`)) return;
    
    setLoading(true);
    setStatus("Starting import...");
    
    let successCount = 0;
    let errorCount = 0;

    for (const course of coursesToImport) {
      try {
        if (!course.code || !course.title) throw new Error("Missing Code or Title");

        await addDoc(collection(db, "courses"), {
          code: course.code,
          title: course.title,
          keywords: course.keywords || "",
        });

        successCount++;
        setStatus(`Importing... ${successCount}/${coursesToImport.length}`);
      } catch (error) {
        console.error("Error importing course:", course.code, error);
        errorCount++;
      }
    }

    setLoading(false);
    setStatus(`Import complete! Success: ${successCount}, Errors: ${errorCount}`);
  };

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Bulk Course Import</h1>
      <p className="text-zinc-500">
        This page allows you to bulk import courses from a hardcoded list in the code.
        Edit the <code>coursesToImport</code> array in <code>client/src/app/temp-bulk-import/page.tsx</code> before clicking the button.
      </p>
      
      <div className="bg-zinc-100 p-4 rounded-lg overflow-auto max-h-64 text-xs font-mono">
        <pre>{JSON.stringify(coursesToImport, null, 2)}</pre>
      </div>

      <Button 
        onClick={handleImport} 
        disabled={loading}
        className="w-full"
      >
        {loading ? `Importing...` : `Import ${coursesToImport.length} Courses`}
      </Button>

      {status && (
        <div className={`p-4 rounded-lg ${status.includes("Error") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
          {status}
        </div>
      )}
    </div>
  );
}
