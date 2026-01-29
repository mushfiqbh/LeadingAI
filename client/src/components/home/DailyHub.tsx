"use client";

import React, { Dispatch, useEffect, useRef, useState } from "react";
import { AlertCircle, MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ViewState } from "@/types/types";
import ActionCard from "../ui/ActionCard";
import ProfileImage from "@/assets/profile.png";
import FrontPageImage from "@/assets/front-page.png";
import ContributeImage from "@/assets/contribute.png";
import ScheduleImage from "@/assets/schedule.png";

interface InfoCardProps {
  title: string;
  content: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
  return (
    <div className="min-w-[85vw] md:min-w-[400px] snap-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
          <div className="text-gray-600 text-sm">{content}</div>
        </div>
      </div>
    </div>
  );
};

interface DailyHubProps {
  setView?: Dispatch<React.SetStateAction<ViewState>>;
  onLoginClick?: () => void;
  isAnonymous?: boolean;
}

const DailyHub: React.FC<DailyHubProps> = ({
  setView,
  onLoginClick,
  isAnonymous,
}) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mock data - replace with actual data from your backend
  const todayClasses = [
    { time: "09:00 AM", subject: "Data Structures", room: "Room 301" },
    { time: "11:00 AM", subject: "Web Development", room: "Lab 2" },
    { time: "02:00 PM", subject: "Database Systems", room: "Room 205" },
    { time: "02:00 PM", subject: "Database Systems", room: "Room 205" },
  ];

  const urgentNotices = [
    "Assignment submission deadline extended to Jan 20",
    "Library will be closed on Jan 18 for maintenance",
  ];

  const upcomingExams = [
    { subject: "Data Structures", date: "Jan 25, 2026", type: "Midterm" },
    { subject: "Web Development", date: "Jan 28, 2026", type: "Quiz" },
  ];

  const cardsData = [
    {
      id: "classes",
      title: "Today's Classes",
      content: (
        <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
          {todayClasses.length > 0 ? (
            todayClasses.map((cls, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Clock className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{cls.subject}</p>
                  <p className="text-xs text-gray-500">
                    {cls.time} • {cls.room}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No classes scheduled for today
            </p>
          )}
        </div>
      ),
    },
    {
      id: "notices",
      title: "Urgent Notices",
      content: (
        <div className="space-y-2">
          {urgentNotices.length > 0 ? (
            urgentNotices.map((notice, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{notice}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No urgent notices</p>
          )}
        </div>
      ),
    },
    {
      id: "exams",
      title: "Upcoming Exams & Deadlines",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          {isAnonymous && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                Login to view
              </span>
            </div>
          )}
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <p className="font-medium text-gray-800">{exam.subject}</p>
                <p className="text-sm text-gray-600">
                  {exam.type} • {exam.date}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No upcoming exams or deadlines
            </p>
          )}
        </div>
      ),
    },
  ];

  // Infinite scroll logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const cardWidth = container.children[0]?.clientWidth || 0;
        const gap = 24; // 1.5rem gap
        const scrollAmount = cardWidth + gap;
        const maxScroll = container.scrollWidth / 2; // Split point for duplicate set

        if (container.scrollLeft >= maxScroll - 50) {
          container.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 24;
      const totalWidth = cardWidth + gap;
      
      // Calculate active index based on scroll position modulo the real list length
      const index = Math.round(container.scrollLeft / totalWidth) % cardsData.length;
      setActiveIndex(index);

      // Infinite scroll loop adjustment
      const maxScroll = container.scrollWidth / 2;
      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 1, behavior: "instant" as ScrollBehavior }); // slightly offset to prevent stickiness
      } else if (container.scrollLeft === 0) {
         // handle left edge?
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-5">
        {/* Main Grid Layout */}
        <div 
           className="relative"
           onMouseEnter={() => setIsPaused(true)}
           onMouseLeave={() => setIsPaused(false)}
           onTouchStart={() => setIsPaused(true)} 
           onTouchEnd={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 mb-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hidden"
          >
            {[...cardsData, ...cardsData].map((card, idx) => (
              <InfoCard
                key={`${card.id}-${idx}`}
                title={card.title}
                content={card.content}
              />
            ))}
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 -mt-4 mb-8">
            {cardsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.children[0]?.clientWidth || 0;
                    const gap = 24;
                    scrollRef.current.scrollTo({
                      left: idx * (cardWidth + gap),
                      behavior: "smooth"
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <button
            className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 text-lg"
            onClick={() => setView && setView('chat')}
          >Chat </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <ActionCard
            onClick={
              () => router.push("/frontpage")
            }
            title="Generate Frontpage"
            description="Create professional academic cover pages"
            image={FrontPageImage}
          />

          <ActionCard
            title="Generate Routine Image"
            description="Generate schedules for your classes or exams"
            image={ScheduleImage}
          />

          <ActionCard
            title="Contribute Content"
            description="Share New Notice, Routine or Drive link"
            image={ContributeImage}
            onClick={() => setView && setView("share")}
          />
          
          <ActionCard
            title="Update Profile"
            description="Manage your personal information and settings"
            image={ProfileImage}
            onClick={() => {
              if (isAnonymous && onLoginClick) {
                onLoginClick();
              } else {
                return setView && setView("profile");
              }
            }}
          />
        </div>
      </div>      

      {/* Footer */}
      <div className="w-full py-6 text-center text-sm text-gray-500">
        <div>© {new Date().getFullYear()} Leading AI Agent. All rights reserved.</div>
        <div>
          Developed by <a href="https://github.com/mushfiqbh" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mushfiq R.</a>
        </div>
      </div>
    </div>
  );
};

export default DailyHub;
