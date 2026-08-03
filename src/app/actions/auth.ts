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
    .from("customers")
    .insert([
      {
        id,
        full_name: fullName,
        email,
        phone_number: phone || "N/A",
        shipping_address: address || "N/A",
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

// ---------------------------------------------------------------------------
// Create a consignor auth user + public.users profile in one server action.
// Uses the service-role key so it bypasses RLS and skips email confirmation.
// ---------------------------------------------------------------------------
interface CreateConsignorParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}

export async function createConsignorAccount({
  email,
  password,
  fullName,
  phone,
  address,
}: CreateConsignorParams): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: "Server misconfiguration: missing environment variables." };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // 1. Create the auth user (email_confirm: true skips the confirmation email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error("Error creating auth user:", authError);
    return { success: false, error: authError.message };
  }

  const userId = authData.user.id;

  // 2. Insert the public.users profile row
  const { error: profileError } = await supabaseAdmin.from("users").insert([
    {
      id: userId,
      role: "consignor",
      full_name: fullName,
      email,
      phone_number: phone,
      address,
    },
  ]);

  if (profileError) {
    console.error("Error creating consignor profile:", profileError);
    // Attempt cleanup — delete the orphaned auth user
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { success: false, error: profileError.message };
  }

  return { success: true };
}
