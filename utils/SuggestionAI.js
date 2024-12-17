import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();


const groq = new Groq({ apiKey: "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" });

export async function suggestionsGenerator(prompt) {
    try {
        const chatCompletion = await getGroqChatCompletion(prompt);
        const responseContent = chatCompletion.choices[0]?.message?.content || "";
        return responseContent;
    } catch (error) {
        console.error("Error generating Suggestion:", error);
        throw new Error("Failed to generate Suggestion");
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
