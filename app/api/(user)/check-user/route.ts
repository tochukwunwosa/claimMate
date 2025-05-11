import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.getUserById(email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: !!data?.user }, { status: 200 });
}
