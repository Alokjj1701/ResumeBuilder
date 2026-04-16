package com.resumebuilder.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;
    private final String fromEmail;
    private final String fromName;

    public EmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from-email:onboarding@resend.dev}") String fromEmail,
            @Value("${app.email.from-name:Resume Builder}") String fromName) {
        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
        this.fromName = fromName;
    }

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromName + " <" + fromEmail + ">")
                    .to(toEmail)
                    .subject("Your verification code — Resume Builder")
                    .html(buildOtpHtml(otp, userName))
                    .build();

            resend.emails().send(params);
            log.info("OTP email sent to {}", toEmail);
        } catch (ResendException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send verification email. Please try again.");
        }
    }

    public void sendPasswordResetEmail(String toEmail, String otp, String userName) {
        String firstName = (userName != null && !userName.isBlank())
                ? userName.split(" ")[0] : "there";
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromName + " <" + fromEmail + ">")
                    .to(toEmail)
                    .subject("Reset your password — Resume Builder")
                    .html(buildPasswordResetHtml(otp, firstName))
                    .build();
            resend.emails().send(params);
            log.info("Password reset email sent to {}", toEmail);
        } catch (ResendException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send password reset email. Please try again.");
        }
    }

    public void sendResumeEmail(String toEmail, String fullName, byte[] pdfBytes, String fileName) {
        String firstName = (fullName != null && !fullName.isBlank())
                ? fullName.split(" ")[0] : "there";
        try {
            Attachment attachment = Attachment.builder()
                    .fileName(fileName)
                    .content(Base64.getEncoder().encodeToString(pdfBytes))
                    .build();

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromName + " <" + fromEmail + ">")
                    .to(toEmail)
                    .subject("your resume's ready ✨")
                    .html(buildResumeEmailHtml(firstName, fileName))
                    .attachments(List.of(attachment))
                    .build();

            resend.emails().send(params);
            log.info("Resume PDF emailed to {}", toEmail);
        } catch (ResendException e) {
            log.error("Failed to send resume email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send resume email. Please try again.");
        }
    }

    private String buildResumeEmailHtml(String firstName, String fileName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
                <tr>
                  <td align="center">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.12);">
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899);padding:36px 40px;text-align:center;">
                          <div style="font-size:40px;margin-bottom:12px;">🚀</div>
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">your resume is ready</h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">looking clean, looking hireable ✨</p>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px;">
                          <p style="margin:0 0 16px;color:#374151;font-size:16px;">hey %s 👋</p>
                          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.7;">
                            your resume is attached — it's polished, ATS-ready, and honestly looking <em>really</em> good.
                            go land that role. you got this. 💪
                          </p>
                          <!-- Attachment badge -->
                          <div style="background:#f5f3ff;border:1.5px solid #ddd6fe;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:24px;">
                            <div style="font-size:24px;">📄</div>
                            <div>
                              <div style="font-weight:700;color:#4c1d95;font-size:14px;">%s</div>
                              <div style="color:#7c3aed;font-size:12px;margin-top:2px;">PDF attachment</div>
                            </div>
                          </div>
                          <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                            pro tip: tailor it for each role using the JD Matcher in the app — seriously makes a difference 🎯
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                          <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Resume Builder · built to help you get hired</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(firstName, fileName);
    }

    private String buildPasswordResetHtml(String otp, String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
                <tr>
                  <td align="center">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.12);">
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899);padding:36px 40px;text-align:center;">
                          <div style="font-size:40px;margin-bottom:12px;">🔐</div>
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Reset your password</h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Use the code below to set a new password</p>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px;">
                          <p style="margin:0 0 20px;color:#374151;font-size:16px;">Hi %s,</p>
                          <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
                            We received a request to reset your password. Enter the code below on the reset page. It expires in <strong>10 minutes</strong>.
                          </p>
                          <!-- OTP Code -->
                          <div style="background:#f5f3ff;border:2px solid #ddd6fe;border-radius:14px;padding:28px;text-align:center;margin-bottom:28px;">
                            <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:monospace;">%s</div>
                          </div>
                          <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;text-align:center;">
                            Didn't request a password reset? You can safely ignore this email.
                          </p>
                          <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                            Do not share this code with anyone.
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                          <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Resume Builder. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(firstName, otp);
    }

    private String buildOtpHtml(String otp, String userName) {
        String firstName = userName != null && !userName.isBlank()
                ? userName.split(" ")[0]
                : "there";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
                <tr>
                  <td align="center">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.12);">
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899);padding:36px 40px;text-align:center;">
                          <div style="width:52px;height:52px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;margin-bottom:16px;">R</div>
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Verify your email</h1>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px;">
                          <p style="margin:0 0 20px;color:#374151;font-size:16px;">Hi %s,</p>
                          <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
                            Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.
                          </p>
                          <!-- OTP Code -->
                          <div style="background:#f5f3ff;border:2px solid #ddd6fe;border-radius:14px;padding:28px;text-align:center;margin-bottom:28px;">
                            <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:monospace;">%s</div>
                          </div>
                          <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;text-align:center;">
                            Didn't request this? You can safely ignore this email.
                          </p>
                          <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                            Do not share this code with anyone.
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                          <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Resume Builder. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(firstName, otp);
    }
}
