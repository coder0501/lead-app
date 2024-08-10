const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// require('../dotenv').config();
const axios = require('axios');

router.post('/signup', async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    // Check for existing email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username is already in use.' });
      }
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // // Verify reCAPTCHA v3 token
    // const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    //   params: {
    //     secret: process.env.RECAPTCHA_SECRET_KEY,
    //     response: captcha,
    //   },
    // });

    // if (!response.data.success || response.data.score < 0.5) {
    //   return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
    // }

    // Your authentication logic
    // Authenticate user (this is just a placeholder)
    const user = await User.findOne({ username:  username});
    console.log(user); //user 
    if (!user ) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check the user object and password property
    console.log('User object:', user);
    console.log('User password:', user.password);
    
    const isMatch =  bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, username: user.username } });

    // res.status(200).json({ token: 'your_jwt_token' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred.' });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("user",user)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    console.log("forgot");
    await user.save();
    console.log("forgot");

    // Send email with reset link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser, to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// Endpoint to handle password reset
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ message: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});


module.exports = router;
