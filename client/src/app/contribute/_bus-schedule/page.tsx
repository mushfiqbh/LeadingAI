"use client";

import { useState } from "react";
import Image from "next/image";
import { Bus, Upload, X } from "lucide-react";

export default function BusScheduleForm() {
  const [busScheduleImage, setBusScheduleImage] = useState<File | null>(null);

  const handleFileUpload = async () => {
    if (busScheduleImage) {
      const formData = new FormData();
      formData.append("image", busScheduleImage);
      formData.append("type", "bustime");
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
          throw new Error("Failed to upload bus schedule image");
        }

        const data = await response.json();
        console.log("Bus schedule uploaded successfully:", data);
        setBusScheduleImage(null);
      } catch (error) {
        console.error("Error uploading bus schedule:", error);
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <Bus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Bus Schedule</h3>
          <p className="text-sm text-gray-600">Upload bus schedule image</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBusScheduleImage(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
            {busScheduleImage ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(busScheduleImage)}
                  alt="Bus schedule preview"
                  width={200}
                  height={128}
                  className="max-w-full h-32 object-contain mx-auto rounded-lg"
                />
                <button
                  onClick={() => setBusScheduleImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Click to upload bus schedule image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </>
            )}
          </div>
        </label>
        <button
          onClick={handleFileUpload}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Submit Bus Schedule
        </button>
      </div>
    </div>
  );
}
