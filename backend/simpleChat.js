import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function runChat() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("what is your name?");
    const response = await result.response;

    console.log("AI:", response.text());

  } catch (err) {
    console.log("ERROR:", err.message);
  }
}

runChat();