import nodemailer from 'nodemailer';
import { InsertContactSubmission } from '../shared/schema';

// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'sales@greenapplex.com',
    pass: process.env.EMAIL_PASS || '' // App password for Gmail
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Email templates
export const createNotificationEmail = (submission: InsertContactSubmission): EmailTemplate => ({
  to: 'sales@greenapplex.com',
  subject: `New Contact Form Submission - ${submission.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">New Contact Form Submission</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Contact Details</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #475569;">Name:</strong> ${submission.name}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #475569;">Email:</strong> 
          <a href="mailto:${submission.email}" style="color: #3b82f6;">${submission.email}</a>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #475569;">Phone:</strong> ${submission.phone || 'Not provided'}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #475569;">Company:</strong> ${submission.company}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #475569;">Service:</strong> ${submission.service}
        </div>
        
        <!-- Budget field removed per user request -->
        
        <div style="margin-top: 25px;">
          <strong style="color: #475569;">Message:</strong>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #d1d5db;">
            ${submission.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            <strong>Source:</strong> ${submission.pageSource || 'Website'}
          </p>
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>This email was sent from the GreenAppleX website contact form.</p>
      </div>
    </div>
  `,
  text: `
New Contact Form Submission

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Company: ${submission.company}
Service: ${submission.service}

Message:
${submission.message}

Source: ${submission.pageSource || 'Website'}
Submitted: ${new Date().toLocaleString()}
  `
});

export const createConfirmationEmail = (submission: InsertContactSubmission): EmailTemplate => ({
  to: submission.email,
  subject: 'Thank you for contacting GreenAppleX - We\'ll be in touch soon!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">Thank You for Contacting Us!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi ${submission.name},</h2>
        
        <p style="color: #475569; line-height: 1.6;">
          Thank you for reaching out to GreenAppleX! We've received your inquiry and our team will review your request shortly.
        </p>
        
        <p style="color: #475569; line-height: 1.6;">
          <strong>What happens next?</strong>
        </p>
        
        <ul style="color: #475569; line-height: 1.6;">
          <li>Our team will review your requirements within 24 hours</li>
          <li>We'll schedule a consultation call to discuss your project</li>
          <li>You'll receive a customized proposal tailored to your needs</li>
        </ul>
        

        
        <p style="color: #475569; line-height: 1.6;">
          In the meantime, feel free to explore our <a href="https://greenapplex.com/" style="color: #3b82f6;">services</a> 
          or check out our <a href="https://greenapplex.com/blog" style="color: #3b82f6;">latest blogs</a> 
          on AI, Web3, and digital transformation.
        </p>
        
        <p style="color: #475569; line-height: 1.6;">
          If you have any urgent questions, please don't hesitate to reach out to us directly at:
        </p>
        
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #d1d5db;">
          <p style="margin: 5px 0; color: #475569;">📧 <strong>Email:</strong></p>
          <p style="margin: 5px 0; color: #475569;">📞 <strong>Phone:</strong> +1 (424) 404-9371</p>
          <p style="margin: 5px 0; color: #475569;">📍 <strong>Address:</strong> 12200 W. Olympic Blvd. Ste. 140, Los Angeles, CA 90064</p>
        </div>
        
        <p style="color: #475569; line-height: 1.6;">
          Thank you for choosing GreenAppleX for your digital transformation needs!
        </p>
        
        <p style="color: #475569; line-height: 1.6;">
          Best regards,<br>
          <strong>The GreenAppleX Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>Follow us on social media for the latest updates:</p>
        <div style="margin-top: 15px;">
          <a href="https://www.linkedin.com/company/greenapplex" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">LinkedIn</a>
          <a href="https://twitter.com/GreenAppleX" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Twitter</a>
        </div>
      </div>
    </div>
  `,
  text: `
Hi ${submission.name},

Thank you for reaching out to GreenAppleX! We've received your inquiry and our team will review your request shortly.

What happens next?
- Our team will review your requirements within 24 hours
- We'll schedule a consultation call to discuss your project
- You'll receive a customized proposal tailored to your needs



If you have any urgent questions, please contact us:
Email:
Phone: +1 (424) 404-9371
Address: 12200 W. Olympic Blvd. Ste. 140, Los Angeles, CA 90064

Thank you for choosing GreenAppleX for your digital transformation needs!

Best regards,
The GreenAppleX Team
  `
});

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    // Verify connection configuration
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"GreenAppleX" <${EMAIL_CONFIG.auth.user}>`,
      to: template.to,
      subject: template.subject,
      text: template.text,
      html: template.html
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendContactNotification(submission: InsertContactSubmission): Promise<{
  notificationSent: boolean;
  confirmationSent: boolean;
}> {
  const notificationEmail = createNotificationEmail(submission);

  // Send notification email to
  const notificationSent = await sendEmail(notificationEmail);

  // Send thank you email to user from
  const confirmationEmail = createConfirmationEmail(submission);
  const confirmationSent = await sendEmail(confirmationEmail);

  return {
    notificationSent,
    confirmationSent
  };
}