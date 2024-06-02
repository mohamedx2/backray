const nodemailer = require('nodemailer');
const Join= require('../models/join');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Outlook SMTP server
    port: 587, // Outlook SMTP port (587 or 465)
    secure: false, // TLS requires secure connection set to false
    auth: {
      user: process.env.EMAIL_USERNAME, // Your Outlook email address
      pass: process.env.EMAIL_PASSWORD // Your Outlook email password
    },
    tls: {
      rejectUnauthorized: false // Ignore SSL certificate verification
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
  
  // Controller to send join code via email
  const sendJoinCodeByEmail = async (req, res) => {
    if(!req.decodedToken.isAdmin)return res.status(500).json({message:"not a admin"})
      const receiver = req.body.receiver;
      const joinkey = generateJoinCode(6);
  
    try {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: receiver,
        subject: 'Your Join Code',
        text: `Your join code is: ${joinkey}`
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
module.exports={sendJoinCodeByEmail}