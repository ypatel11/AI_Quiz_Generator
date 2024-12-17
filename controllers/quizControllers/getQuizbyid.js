import Quiz from "../../model/Quiz.js";
import Submission from "../../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../../model/Question.js";
import { suggestionsGenerator } from "../../utils/SuggestionAI.js";
import { sendEmail } from "../../utils/Sendmail.js";
import { verifyToken } from "../../utils/verifyToken.js";


export const getQuizbyid = asyncHandler(async (req, res) => {
    try {
        const { Quizid } = req.params;
        // console.log(req.params);
       
      
        const quiz = await Quiz.findById(Quizid).populate({
            path: 'questions',
            model: 'Question',
            select: 'questionText options'
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
    
        res.status(200).json({ message: 'Quiz retrieved successfully', data: quiz });
    } catch (error) {
        console.error("Error retrieving quiz:", error);
        res.status(500).json({ message: error.message });
    }

});


