const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Your main User model
const nev = require('email-verification')(mongoose);
const passport = require('passport');
require('./config/passportConfig'); // Configure passport (path as per your config)
const authRoutes = require('./routes/auth'); // Authentication routes
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/YOUR_DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());

// Email verification configuration
nev.configure({
  verificationURL: 'http://localhost:5000/email-verification/${URL}',
  persistentUserModel: User,
  tempUserCollection: 'temp_users',
  transportOptions: {
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  },
  verifyMailOptions: {
    from: 'Do Not Reply <no-reply@yourapp.com>',
    subject: 'Please confirm your account',
    html: 'Click the following link to confirm your account: <a href="${URL}">${URL}</a>',
    text: 'Please confirm your account by clicking the following link: ${URL}'
  },
}, function (err, options) {
  if (err) {
    console.error('Error setting up email verification:', err);
  }
});

// Automatically generate the TempUser model based on User
nev.generateTempUserModel(User);

// Set up authentication routes
app.use('/api/auth', authRoutes);

// Additional routes (if needed) would be added here

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
