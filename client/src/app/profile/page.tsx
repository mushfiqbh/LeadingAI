"use client";

import { useAuth } from "@/context/AuthContext";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserProfileFS, updateUserProfileFS } from "@/lib/firestore";
import { UserProfile } from "@/types/types";
import ProtectedRoute from "@/components/general/ProtectedRoute";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Page() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    batch: "",
    section: "",
    department: "",
    aboutme: "",
    gender: "",
    religion: "",
    birthdate: "",
  });

  // Separate UI state for birthdate components
  const [birthdateUI, setBirthdateUI] = useState({
    year: "",
    month: "",
    day: "",
  });

  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | null>(null);

  // Helper function to parse birthdate and split into components
  const parseBirthdate = (birthdate: string | Date | null) => {
    if (!birthdate) return { year: "", month: "", day: "", formatted: "" };
    
    let dateStr = "";
    if (typeof birthdate === "string") {
      dateStr = birthdate;
    } else if (birthdate instanceof Date) {
      dateStr = birthdate.toISOString().split('T')[0];
    } else {
      return { year: "", month: "", day: "", formatted: "" };
    }
    
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return {
        year: parts[0],
        month: parts[1],
        day: parts[2],
        formatted: dateStr
      };
    }
    return { year: "", month: "", day: "", formatted: "" };
  };

  // Helper function to format birthdate from separate parts
  const formatBirthdate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return "";
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Auto-update profile with debouncing
  useEffect(() => {
    // Skip auto-update on initial load
    if (initialLoad) return;

    const timeoutId = setTimeout(async () => {
      if (!user) return;

      // Update birthdate from separate UI state
      const formattedBirthdate = formatBirthdate(
        birthdateUI.year,
        birthdateUI.month,
        birthdateUI.day
      );
      
      const profileData = {
        ...formData,
        birthdate: formattedBirthdate,
      };

      // Check if any field has content (not just initial empty values)
      const hasContent = Object.values(profileData).some(
        (value) => value.trim() !== ""
      );
      if (!hasContent) return;

      setSaveStatus("saving");
      try {
        const updatedProfile = await updateUserProfileFS(user, profileData);
        setUserProfile(updatedProfile ?? null);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 2000); // Hide "saved" message after 2 seconds
      } catch (error) {
        console.error("Error updating user profile:", error);
        setSaveStatus(null);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [formData, birthdateUI, user, initialLoad]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfileFS(user);
          setUserProfile(profile);
          if (profile) {
            const birthdateParts = parseBirthdate(profile.birthdate || null);
            setFormData({
              fullName: profile.fullName ?? "",
              studentId: profile.studentId ?? "",
              batch: profile.batch ?? "",
              section: profile.section ?? "",
              department: profile.department ?? "",
              aboutme: profile.aboutme ?? "",
              gender: profile.gender ?? "",
              religion: profile.religion ?? "",
              birthdate: birthdateParts.formatted,
            });
            setBirthdateUI({
              year: birthdateParts.year,
              month: birthdateParts.month,
              day: birthdateParts.day,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
          setInitialLoad(false); // Allow auto-updates after initial load
        }
      } else {
        setLoading(false);
        setInitialLoad(false); // Allow auto-updates after initial load
      }
    };
    fetchUserProfile();
  }, [user]);

  if (loading) return <LoadingScreen />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col items-center py-16 px-6">
            <div className="relative group">
              {user?.photoURL ? (
                <Image
                  priority
                  src={user.photoURL}
                  width={120}
                  height={120}
                  alt="Profile Picture"
                  className="rounded-3xl w-30 h-30 object-cover shadow-2xl ring-4 ring-white group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-30 h-30 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl ring-4 ring-white group-hover:scale-105 transition-transform duration-300">
                  <CircleUser className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                {userProfile?.emailVerified ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                {userProfile?.fullName || "Complete Your Profile"}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{userProfile?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-gray-200/50">
                <div
                  className={`w-2 h-2 rounded-full ${
                    userProfile?.emailVerified
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {userProfile?.emailVerified
                    ? "Email verified"
                    : "Email verification pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="max-w-2xl mx-auto px-6 pt-6">
          {saveStatus === "saving" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-blue-700 font-medium">
                  Auto-saving your changes...
                </span>
              </div>
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium">
                  Profile saved automatically
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto px-6 pb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Personal Information
            </h2>

            <div className="space-y-6">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(val) => setFormData({ ...formData, fullName: val })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  >
                    <option value="">Select Gender</option>
                    {["Male", "Female", "Other"].map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    value={formData.religion}
                    onChange={(e) =>
                      setFormData({ ...formData, religion: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  >
                    <option value="">Select Religion</option>
                    {["Islam", "Hindu", "Christian", "Buddhism", "Other"].map(
                      (item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Birth Date
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <select
                      value={birthdateUI.year}
                      onChange={(e) => {
                        setBirthdateUI({ ...birthdateUI, year: e.target.value });
                        const formatted = formatBirthdate(e.target.value, birthdateUI.month, birthdateUI.day);
                        setFormData({ ...formData, birthdate: formatted });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 80 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select
                      value={birthdateUI.month}
                      onChange={(e) => {
                        setBirthdateUI({ ...birthdateUI, month: e.target.value });
                        const formatted = formatBirthdate(birthdateUI.year, e.target.value, birthdateUI.day);
                        setFormData({ ...formData, birthdate: formatted });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        const monthNames = [
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ];
                        return (
                          <option key={month} value={month}>
                            {month} - {monthNames[i]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <select
                      value={birthdateUI.day}
                      onChange={(e) => {
                        setBirthdateUI({ ...birthdateUI, day: e.target.value });
                        const formatted = formatBirthdate(birthdateUI.year, birthdateUI.month, e.target.value);
                        setFormData({ ...formData, birthdate: formatted });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    >
                      <option value="">DD</option>
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = (i + 1).toString().padStart(2, '0');
                        return (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {formData.birthdate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {formData.birthdate}
                  </p>
                )}
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Academic Information
                </h3>

                <div className="space-y-4">
                  <Input
                    label="Student ID"
                    value={formData.studentId}
                    onChange={(val) =>
                      setFormData({ ...formData, studentId: val })
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Batch"
                      value={formData.batch}
                      onChange={(val) =>
                        setFormData({ ...formData, batch: val })
                      }
                    />
                    <Input
                      label="Section"
                      value={formData.section}
                      onChange={(val) =>
                        setFormData({ ...formData, section: val })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">
                        Computer Science and Engineering
                      </option>
                      <option value="ECE">
                        Electronics and Communication Engineering
                      </option>
                      <option value="EEE">
                        Electrical and Electronics Engineering
                      </option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="IT">Information Technology</option>
                      <option value="BBA">
                        Bachelor of Business Administration
                      </option>
                      <option value="MBA">
                        Master of Business Administration
                      </option>
                      <option value="BCA">
                        Bachelor of Computer Applications
                      </option>
                      <option value="MCA">
                        Master of Computer Applications
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About You
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Share information about yourself that the AI can use to
                  provide more personalized assistance
                </p>
                <textarea
                  placeholder="Tell us about your interests, goals, or anything you'd like the AI to know about you..."
                  value={formData.aboutme}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutme: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Reusable Input Component
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
      />
    </div>
  );
}
