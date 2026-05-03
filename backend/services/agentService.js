import { generateResponse } from "./geminiService.js";
import { sendEmail } from "./emailService.js";
import Email from "../models/Email.js";

// 🧠 MEMORY
let userState = {
  step: null,
  data: {}
};

// 📧 Extract email
const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : null;
};

// ⏰ Extract date
const extractDateTime = (text) => {
  const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}).*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  return new Date(
    parseInt(match[3]),
    parseInt(match[2]) - 1,
    parseInt(match[1]),
    parseInt(match[4]),
    parseInt(match[5])
  );
};

export const handleAgentTask = async (query, file) => {
  try {

    // ================= PREVIEW =================
    if (userState.step === "preview") {

      if (query.toLowerCase().includes("yes")) {

        const d = userState.data;

        // 📅 SCHEDULE
        if (d.sendTime) {
          await Email.create({
            to: d.toEmail,
            subject: d.purpose,
            body: d.finalEmail,
            status: "scheduled",
            sendAt: d.sendTime
          });

          userState = { step: null, data: {} };
          return "📅 Email scheduled successfully";
        }

        // 📧 SEND EMAIL (with resume if exists)
        await sendEmail(
          d.toEmail,
          d.purpose,
          d.finalEmail,
          d.resumePath
        );

        await Email.create({
          to: d.toEmail,
          subject: d.purpose,
          body: d.finalEmail,
          status: "sent"
        });

        userState = { step: null, data: {} };

        return "✅ Email sent successfully!";
      }

      // ✏️ EDIT MODE
      userState.data.finalEmail = query;
      return "Do you want to send this updated email? (yes/no)";
    }

    // ================= CONTINUE FLOW =================
    if (userState.step) {

      userState.data[userState.step] = query;
      const d = userState.data;

      let fields = [
        "type",
        "receiverName",
        "purpose",
        "details",
        "callToAction",
        "yourName",
        "yourPosition",
        "phone"
      ];

      // 👉 Job email → ask LinkedIn
      if (d.type === "job") {
        fields.push("linkedin");
      }

      const questions = {
        type: "What type of email? (job / leave / request)",
        receiverName: "Who should I address?",
        purpose: "What is the main purpose?",
        details: "Provide more details.",
        callToAction: "What action do you want?",
        yourName: "Your full name?",
        yourPosition: "Your role?",
        phone: "Your phone number?",
        linkedin: "Your LinkedIn or portfolio link?"
      };

      for (let field of fields) {
        if (!d[field]) {
          userState.step = field;
          return questions[field];
        }
      }

      // ================= RESUME CHECK =================
      if (d.type === "job" && file) {
        userState.data.resumePath = file.path;
      }

      if (d.type === "job" && !d.resumePath) {
        return "📎 Please upload your resume (PDF) before sending.";
      }

      // ================= AI EMAIL GENERATION =================
      const aiEmail = await generateResponse(`
You are a professional email writer.

Write a complete professional email using:

Type: ${d.type}
Receiver: ${d.receiverName}
Purpose: ${d.purpose}
Details: ${d.details}
Action: ${d.callToAction}
Name: ${d.yourName}
Role: ${d.yourPosition}
Phone: ${d.phone}
LinkedIn: ${d.linkedin || "N/A"}

Rules:
- Make it natural and human-like
- Expand properly
- No placeholders
- Professional tone
`);

      userState.data.finalEmail = aiEmail;
      userState.step = "preview";

      return `✉️ Here is your email:

${aiEmail}

👉 You can edit it or type "yes" to send`;
    }

    // ================= NEW EMAIL =================
    const isEmailIntent = /mail|email|send.*mail|send.*email/i.test(query);

    if (isEmailIntent) {

      const email = extractEmail(query);
      if (!email) return "⚠️ Please provide email address";

      userState = {
        step: "type",
        data: {
          toEmail: email,
          sendTime: extractDateTime(query)
        }
      };

      return "What type of email? (job / leave / request)";
    }

    return await generateResponse(query);

  } catch (err) {
    console.log(err);
    return "❌ Something went wrong";
  }
};