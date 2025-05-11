import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// POST method
export async function POST(req: NextRequest) {
  try {
    const { name, email, profession, painPoints, featureRequests } =
      await req.json();
      const supabase = createClient()

    // Insert data into Supabase
    const { error } = await supabase.from("waitlist").insert([
      {
        name,
        email,
        profession,
        painpoints: painPoints,
        featurerequests: featureRequests,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { message: "Error inserting data", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Unexpected error occurred", error: (error as Error).message },
      { status: 500 }
    );
  }
}
