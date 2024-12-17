import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function HintGenerator(prompt) {
    try {
        const chatCompletion = await getGroqChatCompletion(prompt);
        const responseContent = chatCompletion.choices[0]?.message?.content || "";
        return responseContent;
    } catch (error) {
        console.error("Error generating Hint:", error);
        throw new Error("Failed to generate Hint");
    }
}
export async function getGroqChatCompletion(prompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama3-8b-8192",
    });
}
