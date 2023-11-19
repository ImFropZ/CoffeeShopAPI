import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: (process.env.SMTP_PORT || 0) as number,
  auth: {
    user: process.env.SMTP_EMAIL || "",
    pass: process.env.SMTP_EMAIL_PASSWORD || "",
  },
});
