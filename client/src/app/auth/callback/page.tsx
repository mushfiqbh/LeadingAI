"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const saveUserToDB = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      // Try insert, ignore if already exists (on conflict)
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: user.user_metadata.full_name,
          email: user.email || "",
          avatar_url: user.user_metadata.avatar_url,
        },
        { onConflict: "id" }
      );

      router.push("/");
    };

    saveUserToDB();
  }, [router]);

  return <p className="text-center p-6">Signing you in with Google...</p>;
}
