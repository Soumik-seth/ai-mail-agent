import cron from "node-cron";
import Email from "../models/Email.js";
import { sendEmail } from "./emailService.js";

export const startScheduler = () => {

  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking scheduled emails...");

    const now = new Date();

    const emails = await Email.find({
      status: "scheduled",
      sendAt: { $lte: now },
    });

    for (let email of emails) {
      try {
        await sendEmail(email.to, email.subject, email.body);

        email.status = "sent";
        await email.save();

        console.log("✅ Scheduled email sent:", email.to);
      } catch (err) {
        console.log("❌ Failed to send scheduled email");
      }
    }
  });

};