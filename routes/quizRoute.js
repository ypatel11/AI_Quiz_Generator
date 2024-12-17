import express from 'express';
import {getQuestion} from '../controllers/quizControllers/getQuestion.js';
import { createQuiz } from '../controllers/quizControllers/createQuiz.js';
import {getQuizbyid}  from '../controllers/quizControllers/getQuizbyid.js';
import {getQuizHistory} from '../controllers/quizControllers/getQuizHistory.js';
import {submitQuiz} from '../controllers/quizControllers/submitQuiz.js'
import { getHintForQuestion } from '../controllers/bonusController.js';



const quizRouter = express.Router();

// Necessary API routes
quizRouter.post('/create', createQuiz);
quizRouter.post('/submit', submitQuiz);
quizRouter.get('/history', getQuizHistory);
quizRouter.post('/retry', submitQuiz);
quizRouter.get('/oldquiz/:Quizid', getQuizbyid);
quizRouter.get('/question', getQuestion);

// Bonus API routes
quizRouter.get('/hint/:questionId', getHintForQuestion);

export default quizRouter;
