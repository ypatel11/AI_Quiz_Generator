import Quiz from "../../model/Quiz.js";
import Submission from "../../model/Submission.js";
import axios from 'axios';
import { QuizGenerator } from "../../utils/QuizGenerator.js";
import asyncHandler from "express-async-handler";
import Question from "../../model/Question.js";
import { suggestionsGenerator } from "../../utils/SuggestionAI.js";
import { sendEmail } from "../../utils/Sendmail.js";
import { verifyToken } from "../../utils/verifyToken.js";


export const getQuestion = asyncHandler(async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
       
        const total = await Question.countDocuments();
        const pagination = {}
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
      
        let Questions = Question.find();
        Questions = await Questions.skip(startIndex).limit(limit);
      



        res.status(200).json({ message: 'Questipon retrieved successfully', pagination, data: Questions });
    } catch (error) {
        console.error("Error retrieving quiz:", error);
        res.status(500).json({ message: error.message });
    }

});

