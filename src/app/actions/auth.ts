"use server";

import { createClient } from "@supabase/supabase-js";

interface ProfileParams {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

export async function createUserProfile({ id, email, fullName, phone, address }: ProfileParams) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables on the server.");
  }

  // Create an admin client that bypasses RLS
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        id,
        role: "consignor",
        full_name: fullName,
        email,
        phone_number: phone || "N/A",
        address: address || "N/A",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
