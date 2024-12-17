import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true },
    },
    correctOption: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
    tags: [{ type: String }]
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
