'use server';

import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

// Validation schema
const waitlistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  profession: z.string().optional(),
  painPoints: z.string().optional(),
  featureRequests: z.string().optional(),
});

// Type for the form values
export type WaitlistValues = z.infer<typeof waitlistSchema>;

// Server action for form submission
export async function submitWaitlistForm(formData: WaitlistValues) {
  try {
    // Validate the form data
    const validatedFields = waitlistSchema.safeParse(formData);
    
    if (!validatedFields.success) {
      return { 
        success: false, 
        message: 'Validation failed', 
        errors: validatedFields.error.flatten().fieldErrors 
      };
    }

    const { name, email, profession, painPoints, featureRequests } = validatedFields.data;
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return { success: false, message: 'Server configuration error' };
    }
    
    const supabase = await createClient();

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
      console.error("Supabase error:", error);
      return { success: false, message: `Database error: ${error.message}` };
    }

    // Return success before attempting to send email
    // This way if email fails, at least the user data is saved
    return { success: true, message: 'Successfully added to waitlist' };
    
  } catch (error) {
    console.error("Server action error:", error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}
  

 