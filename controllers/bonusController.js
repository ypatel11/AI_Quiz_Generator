import Question from "../model/Question.js";
import asyncHandler from "express-async-handler";
import { HintGenerator } from "../utils/HintGenerator.js";


export const getHintForQuestion = asyncHandler(async (req, res) => {
    try {
        const { questionId } = req.params;


        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const prompt = `
            Provide a helpful  hint for the following question without revealing the answer:
            Question: ${question.questionText}
            Options: ${Object.entries(question.options).map(([key, value]) => `${key}: ${value}`).join(', ')}
            Correct Option: ${question.correctOption}
            (only give the hint, don't write anything else)
        `;
        const aiResponse = await HintGenerator(prompt);  // Function to call the AI
        const hint = aiResponse
        // Return the hint to the client
        res.status(200).json({
            message: 'Hint generated successfully',
            hint
        });

    } catch (error) {
        console.error("Error generating hint:", error);
        res.status(500).json({ message: error.message });
    }
});