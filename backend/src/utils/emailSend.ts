import { Resend } from 'resend';
import CONFIG from '../config/config';

const resend = new Resend(CONFIG.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string; 
}


export const sendEmail = async ({
  to,
  subject,
  html,
  from = 'Acme <onboarding@resend.dev>',
}: SendEmailParams) => {
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error };
  }
};
