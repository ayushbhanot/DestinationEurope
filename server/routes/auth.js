const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 
const nev = require('email-verification')(mongoose); 
const User = require('../models/User');
const router = express.Router();


// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ email, password, nickname: name });

    console.log("Creating temp user..."); // Log this to see where the error occurs

    nev.createTempUser(newUser, (err, existingPersistentUser, newTempUser) => {
      if (err) {
        console.error("Error creating temp user:", err); 
        return res.status(500).json({ message: 'Error creating user', error: err.message });
      }

      console.log("Temp user created:", newTempUser); // Log this to check temp user creation

      if (existingPersistentUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      if (newTempUser) {
        const URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(email, URL, (err) => {
          if (err) return res.status(500).json({ message: 'Error sending email' });

          res.status(201).json({ message: 'Verification email sent. Please verify your email.' });
        });
      } else {
        res.status(400).json({ message: 'User already in temporary collection.' });
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(400).json({ message: info.message });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  })(req, res, next);
});

// Email verification route
router.get('/email-verification/:url', (req, res) => {
  const url = req.params.url;

  nev.confirmTempUser(url, (err, user) => {
    if (err) return res.status(500).json({ message: 'Error verifying user' });

    if (user) {
      return res.status(200).json({ message: 'User verified successfully.' });
    } else {
      return res.status(400).json({ message: 'Verification link expired or invalid.' });
    }
  });
});

// Resend verification route
router.post('/resend-verification', (req, res) => {
  const { email } = req.body;

  nev.resendVerificationEmail(email, (err, userFound) => {
    if (err) return res.status(500).json({ message: 'Error resending email' });

    if (userFound) {
      return res.status(200).json({ message: 'Verification email resent.' });
    } else {
      return res.status(400).json({ message: 'User not found or verification expired.' });
    }
  });
});

module.exports = router;
