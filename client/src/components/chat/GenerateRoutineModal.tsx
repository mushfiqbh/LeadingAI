"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (message: string) => void;
}

export const GenerateRoutineModal: React.FC<GenerateRoutineModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [formData, setFormData] = useState({
    department: "",
    batch: "",
    section: "",
    routineType: "class-routine",
    routineUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const message = `Generate ${formData.routineType === "class-routine" ? "Class" : "Exam"} Routine for ${formData.department} department, Batch ${formData.batch}, Section ${formData.section}. ${formData.routineUrl ? `Routine Data URL: ${formData.routineUrl}` : ""}`;
    
    onGenerate(message);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
            <Input
              required
              placeholder="e.g. CSE, EEE, BBA"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-purple-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Batch</label>
              <Input
                required
                placeholder="e.g. 61"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section</label>
              <Input
                required
                placeholder="e.g. A, B, C"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Routine Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, routineType: "class-routine" })}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all border ${
                  formData.routineType === "class-routine"
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                Class Routine
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, routineType: "exam-routine" })}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all border ${
                  formData.routineType === "exam-routine"
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                Exam Routine
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Routine URL (Optional)</label>
            <Input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/..."
              value={formData.routineUrl}
              onChange={(e) => setFormData({ ...formData, routineUrl: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-purple-500/50"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 border border-white/10 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
