const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Join = require('../models/join');

const transporter = nodemailer.createTransport({
  host: 'mail.mega-tel.de', // SMTP server hostname
  port: 465, // SMTP port
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const controller = {};

function generateJoinCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const sendJoinCodeByEmail = async (req, res) => {
  if (!req.decodedToken.isAdmin) return res.status(500).json({ message: "Not an admin" });

  const receiver = req.body.receiver;
  const joinkey = generateJoinCode(6);

  try {
    // Read and format HTML template
    const templatePath = path.join(__dirname, 'emailTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{joinCode}}', joinkey);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: receiver,
      subject: 'Your Join Code',
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
    const newJoin = new Join({ key: joinkey });
    await newJoin.save();

    res.send({ message: 'Join code sent successfully' });
  } catch (error) {
    console.error('Error sending join code:', error);
    res.status(500).send('An error occurred while sending the join code');
  }
};

module.exports = { sendJoinCodeByEmail };
