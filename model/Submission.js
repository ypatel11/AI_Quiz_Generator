import mongoose from 'mongoose';

// Response schema now references the Question model
const responseSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },  // Now referencing Question
    userResponse: { type: String, required: true },
});

const submissionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    username: { type: String, required: true },
    responses: [responseSchema],  // Array of responses
    score: { type: Number, required: true },
    submittedDate: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
