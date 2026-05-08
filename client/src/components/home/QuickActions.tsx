"use client";

import { useState } from "react";
import {
  MessageSquare,
  FileText,
  Bell,
  Calendar,
  HardDrive,
} from "lucide-react";
import ActionCard from "../ui/ActionCard";
import { Modal } from "../ui/Modal";
import NoticeShare from "../contribute/tabs/NoticeShare";
import RoutineShare from "./RoutineShare";
import DriveShare from "../contribute/tabs/DriveShare";
import { useRouter } from "next/dist/client/components/navigation";

export default function QuickActions() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<
    "notice" | "routine" | "drive" | null
  >(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          onClick={() => router.push("/frontpage")}
          title="Generate Frontpage"
          description="Create professional academic cover pages"
          icon={FileText}
          color="blue"
        />

        <ActionCard
          title="Generate Routine"
          description="Generate class or exam routine image"
          icon={Calendar}
          color="purple"
          onClick={() => setActiveModal("routine")}
        />

        {/* <ActionCard
          onClick={() => router.push("/chat")}
          title="Chat with AI"
          description="Get instant help with your academic tasks"
          icon={MessageSquare}
          color="blue"
        /> */}

        <ActionCard
          title="Share Notice"
          description="Share new exam notice or campus updates"
          icon={Bell}
          color="orange"
          onClick={() => setActiveModal("notice")}
        />

        <ActionCard
          title="Drive Links"
          description="Share important semester drive folders"
          icon={HardDrive}
          color="green"
          onClick={() => setActiveModal("drive")}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === "notice"}
        onClose={() => setActiveModal(null)}
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
          <NoticeShare />
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "routine"}
        onClose={() => setActiveModal(null)}
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
          <RoutineShare />
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "drive"}
        onClose={() => setActiveModal(null)}
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
          <DriveShare />
        </div>
      </Modal>
    </div>
  );
}
