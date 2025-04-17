import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const folder = path.dirname(__filename);

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email_user,
    pass: process.env.email_password,
  },
});

export const SendMail = async (email: string, otp: string) => {
  try {
    const htmlPath = path.join(folder, "../emails/email.html");

    let htmlContent = fs.readFileSync(htmlPath, "utf8");
    htmlContent = htmlContent.replace("{{code}}", otp);
    await transport.sendMail({
      from: `"noreply" <${process.env.email_user}>`,
      to: email,
      subject: "Verify your email",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};
