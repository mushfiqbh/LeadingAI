import { supabase } from "@/lib/supabaseClient";

export async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign-out error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

export async function handleSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: "Login failed. No user returned." };
  }

  return { success: true, user };
}

export async function handleCreateAccount({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) {
  // 1. Create user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  const user = signUpData.user;
  if (!user) {
    return { error: "User creation failed" };
  }

  // 2. Save additional user info in profiles table
  const { error: userError } = await supabase.from("profiles").insert([
    {
      id: user.id,
      full_name: fullName,
      avatar_url: user.user_metadata.avatar_url ?? null,
    },
  ]);

  if (userError) {
    return { error: userError.message };
  }

  return { success: true, user };
}
