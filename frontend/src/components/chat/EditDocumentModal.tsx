"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { Document } from "@/types/types";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSave: () => void;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  document, 
  onSave 
}) => {
  const [courseCode, setCourseCode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setCourseCode(document.course_code || "");
      setCategory(document.category || "");
      setDescription(document.description || "");
    }
  }, [document]);

  const handleSave = async () => {
    if (!document) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("documents")
        .update({
          course_code: courseCode,
          category: category,
          description: description
        })
        .eq("id", document.id);

      if (error) throw error;
      onSave();
      onClose();
    } catch (err) {
      console.error("Error updating document:", err);
      alert("Failed to update document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Edit Document</h2>
          <p className="text-sm text-gray-400 truncate mt-1">{document?.file_name}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Course Code</label>
          <Input 
            value={courseCode} 
            onChange={(e) => setCourseCode(e.target.value)} 
            placeholder="e.g. CSE-1101"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 text-sm rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1a1a1a]">Select a category</option>
            <option value="textbook" className="bg-[#1a1a1a]">Textbook</option>
            <option value="lecture" className="bg-[#1a1a1a]">Lecture</option>
            <option value="scanned" className="bg-[#1a1a1a]">Scanned</option>
            <option value="slides" className="bg-[#1a1a1a]">Slides</option>
            <option value="notes" className="bg-[#1a1a1a]">Notes</option>
            <option value="handwritten" className="bg-[#1a1a1a]">Handwritten</option>
            <option value="mixed" className="bg-[#1a1a1a]">Mixed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <textarea
            className="w-full h-24 p-3 text-sm rounded-xl border border-white/10 bg-white/5 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of the document"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-white hover:bg-white/5">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white border-none">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
