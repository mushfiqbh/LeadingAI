"use client";

import { useState } from "react";
import ActionCard from "../ui/ActionCard";
import { Modal } from "../ui/Modal";
import NoticeShare from "../contribute/tabs/NoticeShare";
import RoutineShare from "../contribute/tabs/RoutineShare";
import DriveShare from "../contribute/tabs/DriveShare";
import { Bell, Calendar, HardDrive } from "lucide-react";

export default function QuickContribute() {
  const [activeModal, setActiveModal] = useState<"notice" | "routine" | "drive" | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ActionCard
        title="Share Notice"
        description="Share new exam notice or campus updates"
        icon={Bell}
        color="orange"
        onClick={() => setActiveModal("notice")}
      />

      <ActionCard
        title="Post Routine"
        description="Share class or exam routine sheets"
        icon={Calendar}
        color="purple"
        onClick={() => setActiveModal("routine")}
      />

      <ActionCard
        title="Drive Links"
        description="Share important semester drive folders"
        icon={HardDrive}
        color="green"
        onClick={() => setActiveModal("drive")}
      />

      {/* Modals */}
      <Modal isOpen={activeModal === "notice"} onClose={() => setActiveModal(null)}>
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Share Notice</h2>
            <NoticeShare />
        </div>
      </Modal>

      <Modal isOpen={activeModal === "routine"} onClose={() => setActiveModal(null)}>
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Post Routine</h2>
            <RoutineShare />
        </div>
      </Modal>

      <Modal isOpen={activeModal === "drive"} onClose={() => setActiveModal(null)}>
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Share Drive Link</h2>
            <DriveShare />
        </div>
      </Modal>
    </div>
  );
}
