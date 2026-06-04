package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final String frontendBaseUrl;
    private final String fromAddress;

    public MailService(JavaMailSender mailSender,
                       @Value("${app.frontend-base-url}") String frontendBaseUrl,
                       @Value("${app.mail.from:}") String fromAddress,
                       @Value("${spring.mail.username:}") String smtpUsername) {
        this.mailSender = mailSender;
        this.frontendBaseUrl = frontendBaseUrl;
        this.fromAddress = fromAddress == null || fromAddress.isBlank() ? smtpUsername : fromAddress;
    }

    public void sendWelcomeMail(User user) {
        String loginLink = frontendBaseUrl + "/login";
        String subject = "Welcome to RoomRent Maharashtra";
        String text = """
            Hello %s,

            Your account has been created successfully.
            Login here: %s

            Thanks,
            RoomRent Maharashtra
            """.formatted(user.getName(), loginLink);
        String html = buildHtmlEmail(
            "Welcome to RoomRent Maharashtra",
            "Welcome",
            user.getName(),
            "Your account has been created successfully.",
            "You can now log in and start using RoomRent Maharashtra.",
            loginLink,
            "Login to your account"
        );
        sendHtmlMail(user.getEmail(), subject, text, html);
    }

    public void sendPasswordResetMail(User user, String token) {
        String resetLink = UriComponentsBuilder.fromHttpUrl(frontendBaseUrl)
            .path("/reset-password")
            .queryParam("token", token)
            .toUriString();
        String subject = "Reset your RoomRent Maharashtra password";
        String text = """
            Hello %s,

            We received a request to reset your password.
            Use this link to set a new password: %s

            This link will expire soon. If you didn't request this, you can ignore this email.

            Thanks,
            RoomRent Maharashtra
            """.formatted(user.getName(), resetLink);
        String html = buildHtmlEmail(
            "Reset your password",
            "Password Reset",
            user.getName(),
            "We received a request to reset your password.",
            "Use the button below to create a new password. This link expires in 30 minutes.",
            resetLink,
            "Reset password"
        );
        sendHtmlMail(user.getEmail(), subject, text, html);
    }

    private void sendHtmlMail(String to, String subject, String text, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(to);
            if (fromAddress != null && !fromAddress.isBlank()) {
                helper.setFrom(fromAddress);
            }
            helper.setSubject(subject);
            helper.setText(text, html);
            mailSender.send(message);
        } catch (MessagingException ex) {
            throw new IllegalStateException("Unable to send email", ex);
        }
    }

    private String buildHtmlEmail(String title, String eyebrow, String recipientName, String lead, String body, String ctaLink, String ctaLabel) {
        return String.format("""
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>%s</title>
              </head>
              <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                <div style="display:none;max-height:0;overflow:hidden;opacity:0;">%s</div>
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
                        <tr>
                          <td style="padding:28px 32px;background:linear-gradient(135deg,#0f9f8f 0%%,#ef3d81 58%%,#ff7a35 100%%);color:white;">
                            <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">RoomRent Maharashtra</div>
                            <div style="margin-top:10px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;opacity:0.9;">%s</div>
                            <div style="margin-top:8px;font-size:28px;line-height:1.2;font-weight:800;">%s</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:32px;">
                            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hello %s,</p>
                            <p style="margin:0 0 12px;font-size:18px;line-height:1.6;font-weight:700;color:#111827;">%s</p>
                            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">%s</p>
                            <div style="margin:28px 0 18px;">
                              <a href="%s" style="display:inline-block;background:linear-gradient(135deg,#0f9f8f 0%%,#ef3d81 58%%,#ff7a35 100%%);color:#ffffff;text-decoration:none;font-weight:800;padding:14px 22px;border-radius:16px;">%s</a>
                            </div>
                            <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
                              If the button does not work, open this link:
                              <br />
                              <a href="%s" style="color:#0f9f8f;word-break:break-all;">%s</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """,
            title,
            eyebrow,
            title,
            recipientName,
            lead,
            body,
            ctaLink,
            ctaLabel,
            ctaLink,
            ctaLink
        );
    }
}
