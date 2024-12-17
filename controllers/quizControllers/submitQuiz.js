import Quiz from "../../model/Quiz.js";
import Submission from "../../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../../model/Question.js";
import { suggestionsGenerator } from "../../utils/SuggestionAI.js";
import { sendEmail } from "../../utils/Sendmail.js";
import { verifyToken } from "../../utils/verifyToken.js";



export const submitQuiz = asyncHandler(async (req, res) => {
    try {
        const { quizId, responses, email } = req.body;
        if (!req.headers?.authorization) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = req.headers.authorization.split(" ")[1];
        // Verify token and get user info from the auth service
        
           const response = verifyToken(token)
        
        
        if (!response) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const username = response.username;

        // quiz by quizId
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const { TotalQuestions, MaxScore } = quiz;
        const scorePerQuestion = MaxScore / TotalQuestions;
        let totalScore = 0;
        const evaluatedResponses = await Promise.all(responses.map(async (response) => {
            const question = await Question.findById(response.questionId);  
            if (!question) {
                throw new Error(`Question with ID ${response.questionId} not found.`);
            }
            const isCorrect = response.userResponse === question.correctOption;
            if (isCorrect) {
                totalScore += scorePerQuestion;
            }

            return {
                questionId: response.questionId,
                questionText: question.questionText,
                userResponse: response.userResponse,
                correctOption: question.correctOption,
                isCorrect
            };
        }));
        const submission = new Submission({
            quizId,
            username,
            responses: evaluatedResponses.map(r => ({
                questionId: r.questionId,
                userResponse: r.userResponse
            })),
            score: totalScore,
            submittedDate: new Date(),
        });

        await submission.save();

        if (email !== undefined) {
            const suggestionsPrompt = `
            Based on the following performance in a quiz, provide two short skill improvement suggestions in second person
            (give entire two suggestion in one square bracket):
            Score: ${totalScore}/${MaxScore}
            Performance: ${evaluatedResponses.map(response => `
                Question: ${response.questionText}, Correct: ${response.isCorrect ? 'Yes' : 'No'}
            `).join(' ')}
        `;
            const aiResponse = await suggestionsGenerator(suggestionsPrompt);
             console.log(aiResponse);

            const AIsuggestions = aiResponse?.match(/\[(.*?)\]/)[1];
            await sendEmail(email, totalScore, MaxScore, evaluatedResponses, AIsuggestions);
            res.status(201).json({
                message: 'Quiz submitted and results emailed successfully',
                totalScore,
                evaluatedResponses
            });
        }
        else {
            res.status(201).json({
                message: 'Quiz submitted successfully',
                totalScore,
                evaluatedResponses
            });
        }
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: error.message });
    }
});