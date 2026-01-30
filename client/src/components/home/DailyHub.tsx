"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AlertCircle, MessageSquare, Clock, Settings, FileText, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionCard from "../ui/ActionCard";
import { AuthContext } from "@/context/AuthContext";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import refineDepartmentName from "@/utils/refineDepartmentName";
import { updateUserProfileFS, getLatestClassRoutine } from "@/lib/firestore";
import { useFrontPageStore } from "@/store/useFrontPageStore";
import QuickContribute from "./QuickContribute";

interface InfoCardProps {
  title: string;
  content: React.ReactNode;
  action?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, action }) => {
  return (
    <div className="min-w-[85vw] md:min-w-[400px] snap-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {action}
          </div>
          <div className="text-gray-600 text-sm">{content}</div>
        </div>
      </div>
    </div>
  );
};


const DailyHub: React.FC = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { user, userProfile } = useContext(AuthContext);
  const { courses, teachers, fetchData: fetchFrontPageData } = useFrontPageStore();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dept, setDept] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [displayDayLabel, setDisplayDayLabel] = useState("Today");
  const [loadingRoutine, setLoadingRoutine] = useState(false);

  useEffect(() => {
    if (courses.length === 0 || teachers.length === 0) {
      fetchFrontPageData();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("user_info");
      const parsed = savedInfo ? JSON.parse(savedInfo) : null;

      setDept(userProfile?.department || parsed?.department || "");
      setBatch(userProfile?.batch || parsed?.batch || "");
      setSection(userProfile?.section || parsed?.section || "");
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!dept || !batch || !section) {
        setTodayClasses([]);
        return;
      }
      setLoadingRoutine(true);

      const refinedDept = refineDepartmentName(dept);

      try {
        const routineDoc = await getLatestClassRoutine(refinedDept);
        if (routineDoc) {
          const schedules = routineDoc.schedules || [];
          
          const userSchedule = schedules.find((s: any) => 
            String(s.batch) === String(batch) && 
            s.section.toLowerCase() === section.toLowerCase()
          );

          if (userSchedule && userSchedule.content) {
            const content = JSON.parse(userSchedule.content);
            const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const today = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
            const todayIndex = daysOrder.indexOf(today);

            let foundClasses = [];
            let foundDayLabel = "Today";

            for (let i = 0; i < 7; i++) {
              const checkIndex = (todayIndex + i) % 7;
              const checkDay = daysOrder[checkIndex];
              const dayData = content.find((d: any) => d.day === checkDay);
              
              if (dayData && dayData.classes && dayData.classes.length > 0) {
                foundClasses = dayData.classes.map((c: any) => {
                  const regex = /^\s*([A-Z]{3}\s*-\s*\d{4})\s+([A-Z]{2,3})\s+(.+)\s*$/i;
                  const match = c.course.match(regex);
                  
                  let courseTitle = c.course;
                  let teacherName = "";
                  let roomNo = c.room || "N/A";

                  if (match) {
                    let [, extractedCC, extractedTC, extractedRN] = match;
                    const courseCode = extractedCC.replace(/\s*-\s*/, "-").toUpperCase();
                    const teacherCode = extractedTC.toUpperCase();
                    roomNo = extractedRN.trim();

                    const courseObj = courses.find((crs) => crs.code === courseCode);
                    const teacherObj = teachers.find((t) => t.code === teacherCode);

                    courseTitle = courseObj ? courseObj.title : courseCode;
                    teacherName = teacherObj ? teacherObj.name : teacherCode;
                  }

                  return {
                    time: c.time,
                    subject: courseTitle,
                    teacher: teacherName,
                    room: roomNo
                  };
                });
                foundDayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : checkDay;
                break;
              }
            }

            setTodayClasses(foundClasses);
            setDisplayDayLabel(foundDayLabel);
          } else {
            setTodayClasses([]);
            setDisplayDayLabel("Today");
          }
        } else {
          setTodayClasses([]);
          setDisplayDayLabel("Today");
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
        setTodayClasses([]);
        setDisplayDayLabel("Today");
      } finally {
        setLoadingRoutine(false);
      }
    };

    fetchRoutine();
  }, [dept, batch, section, courses, teachers]);

  const handleUpdateInfo = async () => {
    const info = { department: dept, batch, section };
    if (user) {
      await updateUserProfileFS(user, info);
    } else {
      localStorage.setItem("user_info", JSON.stringify(info));
    }
    setIsUpdateModalOpen(false);
  };

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
      title: displayDayLabel === "Today" ? "Today's Classes" : `${displayDayLabel}'s Classes`,
      action: (
        <button 
          onClick={() => setIsUpdateModalOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <Settings className="w-3 h-3" />
          Update Info
        </button>
      ),
      content: (
        <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
          {loadingRoutine ? (
            <p className="text-gray-500 italic">Loading routine...</p>
          ) : todayClasses.length > 0 ? (
            todayClasses.map((cls, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 leading-tight">{cls.subject}</p>
                  {cls.teacher && (
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{cls.teacher}</p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {cls.time}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                    {cls.room}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 italic">
                {(!dept || !batch || !section) 
                  ? "Set your department, batch, and section to see today's routine" 
                  : "No classes scheduled for today"}
              </p>
              {(!dept || !batch || !section) && (
                <button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Update Information
                </button>
              )}
            </div>
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
    }, 5000);

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
                action={card.action}
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

        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              onClick={() => router.push("/frontpage")}
              title="Generate Frontpage"
              description="Create professional academic cover pages"
              icon={FileText}
              color="blue"
            />
            
            <ActionCard
              onClick={() => router.push("/chat")}
              title="Chat with AI"
              description="Get instant help with your academic tasks"
              icon={MessageSquare}
              color="blue"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 pt-4">Contribute</h2>
          <QuickContribute />
        </div>
      </div>      

      {/* Footer */}
      <div className="w-full py-6 text-center text-sm text-gray-500">
        <div>© {new Date().getFullYear()} Leading AI Agent. All rights reserved.</div>
        <div>
          Developed by <a href="https://github.com/mushfiqbh" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mushfiq R.</a>
        </div>
      </div>

      {/* Update Info Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Update Your Information</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Input 
              value={dept} 
              onChange={(e) => setDept(e.target.value)}
              placeholder="e.g. CSE, EEE, Architecture"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <Input 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g. 58"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Input 
                value={section} 
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. A"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateInfo}>
              Save Information
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailyHub;
