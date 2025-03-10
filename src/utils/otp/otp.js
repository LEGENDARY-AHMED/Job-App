import nodemailer from "nodemailer";
import { EventEmitter } from "events";

export const sendOTPEvent = new EventEmitter();

const sendOTP = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"JOP-APP" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

sendOTPEvent.on("sendOTP", async ({ email, otp }) => {
  await sendOTP({
    to: email,
    subject: "Your One-Time Password (OTP)",
    html: `<h1>Your OTP is: <b>${otp}</b></h1>`,
  });
});

