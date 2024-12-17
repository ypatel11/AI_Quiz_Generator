import Quiz from "../../model/Quiz.js";
import Submission from "../../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../../model/Question.js";
import { suggestionsGenerator } from "../../utils/SuggestionAI.js";
import { sendEmail } from "../../utils/Sendmail.js";
import { verifyToken } from "../../utils/verifyToken.js";


export const getQuizHistory = asyncHandler(async (req, res) => {
    try {
        const { grade, subject, minScore, maxScore, fromDate, toDate } = req.query;
        //check if no header toekn is provided
        if (!req.headers?.authorization) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = req.headers.authorization.split(" ")[0];
        const response = verifyToken(token)
       
        if (!response) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const username = response.username;
        let query = { username };

    
        const quizMatch = {};
        if (grade) { quizMatch.grade = Number(grade); }
        if (subject) { quizMatch.Subject = subject; }
        if (minScore) { query.score = { ...query.score, $gte: Number(minScore) }; }
        if (maxScore) { query.score = { ...query.score, $lte: Number(maxScore) }; }
        if (fromDate || toDate) {
            query.submittedDate = {};
            if (fromDate) {
                query.submittedDate.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.submittedDate.$lte = new Date(toDate);
            }
        }
        console.log(query);
        // console.log(quizMatch);
        const submissions = await Submission.find(query)
            .populate({
                path: 'quizId',
                match: quizMatch,
                select: 'grade Subject TotalQuestions MaxScore Difficulty',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    select: 'questionText options correctOption'
                }
            })
            .exec();
            //fileter 
        const filteredSubmissions = submissions.filter(sub => sub.quizId !== null);
        
        
        if (filteredSubmissions.length !== 0) {
            res.status(200).json({
                message: 'Quiz history retrieved successfully',
                data: filteredSubmissions
            });
        }
        else {
            res.status(404).json({ message: 'No quiz history found' });
        }

    } catch (error) {
        console.error("Error retrieving quiz history:", error);
        res.status(500).json({ message: error.message });
    }
});

