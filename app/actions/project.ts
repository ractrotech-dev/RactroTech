'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitProjectEnquiry(prevState: { message: string; success: boolean }, formData: FormData) {
  const supabase = createClient();

  const enquiry = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: (formData.get('email') as string) || null,
    project_type: formData.get('projectType') as string,
    description: formData.get('description') as string,
  };

  try {
    // 1. Store in Supabase
    const { error: dbError } = await supabase
      .from('project_enquiries')
      .insert([enquiry]);

    if (dbError) {
      console.error('Database Error:', dbError);
      return { message: 'Failed to store enquiry. Please try again.', success: false };
    }

    // 2. Notification (Optional: Integrate with Email/WhatsApp API)
    // Placeholder for email notification (e.g., via Resend or a Supabase Edge Function)
    // If you add a RESEND_API_KEY to your .env, you can use the code below:
    /*
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'RactroTech Enquiries <onboarding@resend.dev>',
          to: 'ractrotech@gmail.com',
          subject: `New Project Enquiry: ${enquiry.project_type}`,
          text: `Name: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email || 'N/A'}\n\nDescription: ${enquiry.description}`,
        }),
      });
    }
    */

    revalidatePath('/dashboard');
    return { message: 'Thank you! Your enquiry has been submitted. We will get in touch soon.', success: true };
  } catch (error) {
    console.error('Submission Error:', error);
    return { message: 'An unexpected error occurred. Please try again later.', success: false };
  }
}
