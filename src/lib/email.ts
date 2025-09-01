import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string, 
  token: string, 
  verificationUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PyThoughts <noreply@pythoughts.dev>',
      to: [email],
      subject: 'Welcome to PyThoughts - Verify Your Email',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fafafa; border-radius: 12px; overflow: hidden;">
          <!-- Header with Python theme -->
          <div style="background: linear-gradient(135deg, #3776ab 0%, #ffd43b 100%); padding: 32px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0C8.5 0 5.5 1.5 5.5 4v4h7v1H4c-2.2 0-4 1.8-4 4s1.8 4 4 4h2v-3c0-2.2 1.8-4 4-4h7c2.2 0 4-1.8 4-4V4c0-2.5-3-4-6.5-4H12z" fill="#3776ab"/>
                  <path d="M12 24c3.5 0 6.5-1.5 6.5-4v-4h-7v-1h8.5c2.2 0 4-1.8 4-4s-1.8-4-4-4H18v3c0 2.2-1.8 4-4 4H7c-2.2 0-4 1.8-4 4v4c0 2.5 3 4 6.5 4H12z" fill="#ffd43b"/>
                </svg>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">PyThoughts</h1>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">The Python Community Platform</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #3776ab; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Welcome to the community! 🐍</h2>
            
            <p style="color: #a3a3a3; line-height: 1.6; margin: 0 0 24px; font-size: 16px;">
              Thanks for joining PyThoughts, where Python developers connect, share knowledge, and grow together. 
              To get started, please verify your email address.
            </p>

            <!-- Verification Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3776ab, #5094d4); 
                        color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; 
                        font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(55, 118, 171, 0.3);">
                Verify Email Address
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0; line-height: 1.5;">
              If you didn't create an account with PyThoughts, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #262626; margin: 32px 0;">

            <!-- Footer -->
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 PyThoughts. Made with ❤️ for the Python community.
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
                This verification link expires in 24 hours.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Welcome to PyThoughts!

Thanks for joining our Python community platform. To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

If you didn't create an account with PyThoughts, you can safely ignore this email.

This verification link expires in 24 hours.

Best regards,
The PyThoughts Team
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PyThoughts <noreply@pythoughts.dev>',
      to: [email],
      subject: 'Welcome to PyThoughts Community! 🎉',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fafafa; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3776ab 0%, #ffd43b 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 Welcome to PyThoughts!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">You're now part of the Python community</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #3776ab; margin: 0 0 16px; font-size: 20px;">Hi ${name}! 👋</h2>
            
            <p style="color: #a3a3a3; line-height: 1.6; margin: 0 0 24px;">
              Your email has been verified and your account is now active! Here's what you can do:
            </p>

            <!-- Feature List -->
            <div style="margin: 24px 0;">
              <div style="display: flex; align-items: start; gap: 12px; margin: 16px 0;">
                <span style="color: #ffd43b; font-size: 20px;">💬</span>
                <div>
                  <h4 style="color: #fafafa; margin: 0 0 4px; font-size: 16px; font-weight: 600;">Share & Discuss</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">Post code snippets, ask questions, and engage with the community</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: start; gap: 12px; margin: 16px 0;">
                <span style="color: #ffd43b; font-size: 20px;">🤖</span>
                <div>
                  <h4 style="color: #fafafa; margin: 0 0 4px; font-size: 16px; font-weight: 600;">AI Assistant "Viper"</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">Get intelligent Python code reviews and suggestions</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: start; gap: 12px; margin: 16px 0;">
                <span style="color: #ffd43b; font-size: 20px;">🐍</span>
                <div>
                  <h4 style="color: #fafafa; margin: 0 0 4px; font-size: 16px; font-weight: 600;">Learn & Grow</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">Discover best practices and level up your Python skills</p>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.APP_URL}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3776ab, #5094d4); 
                        color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; 
                        font-weight: 600; font-size: 16px;">
                Start Exploring
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #262626; margin: 32px 0;">

            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Happy coding! 🐍✨<br>
                The PyThoughts Team
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }

    return data;
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    throw error;
  }
}