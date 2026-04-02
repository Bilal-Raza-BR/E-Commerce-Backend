const nodemailer = require('nodemailer');
const { modal } = require('../Modal/modal');
const otpStore = require('../OtpStore/otps');
require("dotenv").config();

const forgatPass = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: 'Email is required', success: false });
    }

    const exitingUser = await modal.findOne({ email });

    if (!exitingUser) {
        return res.status(400).send({ message: 'Email is not registered', success: false });
    }
// nodemailer work start *********

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const otp = Math.floor(100000 + Math.random() * 900000);
const expiry = Date.now() +5*60*1000; // 5 minutes
otpStore.push({ email, otp, expiry });

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,

  subject: ' YOUR OTP CODE ',
  text: `Your OTP CODE is ${otp}. It will expire in 5 minutes.`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Email nahi gayi ❌:', error);
    return res.status(500).send({ message: 'Failed to send OTP email', success: false });
  } else {
    console.log('Email gayi ✅:', info.response);
    return res.status(200).send({
      message: 'OTP has been sent to your email',
      success: true,
      email: email
    });
  }
});


  } catch (error) {
    console.error('Error in forgatPass:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

module.exports = forgatPass;