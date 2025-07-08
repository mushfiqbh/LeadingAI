"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, Upload, X } from "lucide-react";
import { Notice } from "@/types/types";
import { getNoticesFS } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

export default function NoticesForm() {
  const { user } = useAuth();
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getNoticesFS();
        if (!response || response.length === 0) {
          console.warn("No notices found");
          return;
        }
        setNotices(response);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const handleFileUpload = async () => {
    if (user && noticeImage) {
      const formData = new FormData();
      formData.append("image", noticeImage);
      formData.append("type", "notice");
      formData.append("user_id", user?.uid);
      formData.append("user_name", user?.displayName || "Anonymous");
      formData.append(
        "expire_date",
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      );

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/upload/notice`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload notice image");
        }

        const data = await response.json();
        console.log("Notice uploaded successfully:", data);
        setNoticeImage(null); // Clear the image after upload
      } catch (error) {
        console.error("Error uploading notice:", error);
      }
    }
  };

  return (
    <div className="w-full md:w-1/2 mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            University Notice
          </h3>
          <p className="text-sm text-gray-600">Upload important notices</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNoticeImage(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer">
            {noticeImage ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(noticeImage)}
                  alt="Notice preview"
                  width={200}
                  height={128}
                  className="max-w-full h-32 object-contain mx-auto rounded-lg"
                />
                <button
                  onClick={() => setNoticeImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload notice image</p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </>
            )}
          </div>
        </label>
        <button
          onClick={handleFileUpload}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Submit Notice
        </button>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Recent Notices
        </h4>
        {notices.length > 0 ? (
          <ul className="space-y-4">
            {notices.map((notice) => (
              <li key={notice.id} className="flex items-start gap-3">
                <Image
                  src={notice.image_url}
                  alt={notice.title}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div>
                  <h5 className="font-semibold text-gray-800">
                    {notice.title}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {notice.contributor?.fullName || "Anonymous"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notices available</p>
        )}
      </div>
    </div>
  );
}
