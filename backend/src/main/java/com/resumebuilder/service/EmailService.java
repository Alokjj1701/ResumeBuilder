package com.resumebuilder.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
