import Quiz from "../../model/Quiz.js";
import Submission from "../../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../../model/Question.js";
import { suggestionsGenerator } from "../../utils/SuggestionAI.js";
import { sendEmail } from "../../utils/Sendmail.js";
import { verifyToken } from "../../utils/verifyToken.js";





export const createQuiz = asyncHandler(
    async (req, res) => {
        try {
            const { grade, Subject, TotalQuestions, MaxScore, Difficulty } = req.body;
            if (!req.headers?.authorization) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = req.headers.authorization.split(" ")[1];

            // question genration
            const generatedQuestions = await QuizGenerator(grade, Subject, TotalQuestions, MaxScore, Difficulty);

            //token verify
            const response = verifyToken(token)
            if (!response) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            const username = response.username;
            const questionIds = [];

            for (const questionData of generatedQuestions) {
                const question = new Question({
                    questionText: questionData.questionText,
                    options: questionData.options,
                    correctOption: questionData.correctOption,
                    difficulty: Difficulty,
                });
                await question.save();
                questionIds.push(question._id);
            }

            let quiz = new Quiz({
                grade,
                Subject,
                TotalQuestions,
                MaxScore,
                Difficulty,
                questions: questionIds,
                createdBy: username,
                createdDate: new Date(),
            });

            await quiz.save();
            
            quiz = await Quiz.findById(quiz._id).populate({
                path: 'questions',
                model: 'Question',
                select: 'questionText options'
            });
            res.status(201).json({ message: 'Quiz created successfully', quiz });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
);
