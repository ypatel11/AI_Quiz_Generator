import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({ apiKey: "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"});

export async function QuizGenerator(grade, subject, totalQuestions, maxScore, difficulty) {
    try {
        const chatCompletion = await getGroqChatCompletion(grade, subject, totalQuestions, maxScore, difficulty);
        const responseContent = chatCompletion.choices[0]?.message?.content || "";

        const jsonArrayMatch = responseContent.match(/\[.*\]/s);

        if (!jsonArrayMatch) {
            throw new Error("No valid JSON array found in the response");
        }

        const parsedResponse = JSON.parse(jsonArrayMatch[0]);
        return parsedResponse;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz");
    }
}
export async function getGroqChatCompletion(grade, subject, totalQuestions, maxScore, difficulty) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Need quiz in this JSON format (only give JSON format, don't write anything else): 
                questionText: { type: String, required: true },
                options: {
                    A: { type: String, required: true },
                    B: { type: String, required: true },
                    C: { type: String, required: true },
                    D: { type: String, required: true },
                },
                correctOption: { type: String, enum: ['A', 'B', 'C', 'D'], required: true }
                for grade ${grade}, subject ${subject}, totalQuestions ${totalQuestions}, maxScore ${maxScore}, and difficulty ${difficulty}.
                `,
            },
        ],
        model: "llama3-8b-8192",
    });
}
