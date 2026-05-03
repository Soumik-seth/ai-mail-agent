import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text, resumePath = null) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (resumePath) {
    mailOptions.attachments = [
      {
        filename: "resume.pdf",
        path: resumePath,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);
};