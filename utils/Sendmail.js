import nodemailer from 'nodemailer';


export const sendEmail = async (userEmail, score, maxScore, responses, suggestions) => {
    // console.log(responses);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "ybpatel117@gmail.com",
            pass: "axkk nqcs ckbp bdlh" ,
        },
    });
    const mailOptions = {
        from: { name: 'Quiz App', address: process.env.USER_MAIL },
        to: userEmail,
        subject: 'Your Quiz Results and Skill Improvement Suggestions',
        text: `
            Hi,
            
            Here are your quiz results:
            Score: ${score}/${maxScore}

            Your performance on each question:
            ${responses.map(response => `
                Question: ${response.questionText}
                Your Response: ${response.userResponse}
                Correct Answer: ${response.correctOption}
                Correct: ${response.isCorrect ? 'Yes' : 'No'}
            `).join('')}

            Suggestions for improving your skills:
            ${suggestions}
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}