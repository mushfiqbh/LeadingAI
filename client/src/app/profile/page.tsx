"use client";

import { useAuth } from "@/context/AuthContext";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserProfileFS, updateUserProfileFS } from "@/lib/firestore";
import { UserProfile } from "@/types";
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
  });

  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | null>(null);

  // Auto-update profile with debouncing
  useEffect(() => {
    // Skip auto-update on initial load
    if (initialLoad) return;
    
    const timeoutId = setTimeout(async () => {
      if (!user) return;
      
      // Check if any field has content (not just initial empty values)
      const hasContent = Object.values(formData).some(value => value.trim() !== '');
      if (!hasContent) return;
      
      setSaveStatus('saving');
      try {
        const updatedProfile = await updateUserProfileFS(user, formData);
        setUserProfile(updatedProfile ?? null);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000); // Hide "saved" message after 2 seconds
      } catch (error) {
        console.error("Error updating user profile:", error);
        setSaveStatus(null);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [formData, user, initialLoad]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfileFS(user);
          setUserProfile(profile);
          if (profile) {
            setFormData({
              fullName: profile.fullName ?? "",
              studentId: profile.studentId ?? "",
              batch: profile.batch ?? "",
              section: profile.section ?? "",
              department: profile.department ?? "",
              aboutme: profile.aboutme ?? "",
              gender: profile.gender ?? "",
              religion: profile.religion ?? "",
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
      <div className="min-h-screen bg-gray-50 px-6 pb-10">
        <div className="flex flex-col items-center py-10">
          {user?.photoURL ? (
            <Image
              priority
              src={user.photoURL}
              width={96}
              height={96}
              alt="Profile Picture"
              className="rounded-full w-24 h-24 object-cover"
            />
          ) : (
            <CircleUser className="w-24 h-24 text-gray-400" />
          )}
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">
              {userProfile?.fullName || "Name not set"}
            </p>
            <p className="text-sm text-gray-500">{userProfile?.email}</p>
            <p className="text-xs text-gray-400">
              {userProfile?.emailVerified
                ? "Email verified"
                : "Email not verified"}
            </p>
          </div>
        </div>

        {saveStatus === 'saving' && (
          <div className="text-center text-sm text-blue-500 mb-4">
            Auto-saving...
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="text-center text-sm text-green-500 mb-4">
            ✓ Profile saved automatically
          </div>
        )}

        <div className="w-full max-w-md mx-auto space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(val) => setFormData({ ...formData, fullName: val })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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
              <label className="block text-sm text-gray-600 mb-1">
                Religion
              </label>
              <select
                value={formData.religion}
                onChange={(e) =>
                  setFormData({ ...formData, religion: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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

          <Input
            label="Student ID"
            value={formData.studentId}
            onChange={(val) => setFormData({ ...formData, studentId: val })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Batch"
              value={formData.batch}
              onChange={(val) => setFormData({ ...formData, batch: val })}
            />
            <Input
              label="Section"
              value={formData.section}
              onChange={(val) => setFormData({ ...formData, section: val })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="ECE">
                Electronics and Communication Engineering
              </option>
              <option value="EEE">
                Electrical and Electronics Engineering
              </option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="BBA">Bachelor of Business Administration</option>
              <option value="MBA">Master of Business Administration</option>
              <option value="BCA">Bachelor of Computer Applications</option>
              <option value="MCA">Master of Computer Applications</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Anything About You AI Will Use
            </label>
            <textarea
              placeholder="About Me"
              value={formData.aboutme}
              onChange={(e) =>
                setFormData({ ...formData, aboutme: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={4}
            />
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
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}
