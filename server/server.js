require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const nev = require('email-verification')(mongoose);
const authRoutes = require('./routes/auth'); // Authentication routes
const User = require('./models/User'); // Your main User model
const protectedRoute = require('./routes/protectedRoute');

const app = express();

console.log('Base URL:', process.env.APP_BASE_URL);

// Connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());
require('./config/passport-config'); // Ensure this is included after initializing Passport


app.use('/api/protected', protectedRoute);
app.use('/api/auth', authRoutes);  

// Email verification configuration using environment variables
nev.configure({
  verificationURL: `${process.env.APP_BASE_URL}/email-verification/\${URL}`, // Update to use APP_BASE_URL
  persistentUserModel: User,
  tempUserCollection: 'temp_users',
  transportOptions: {
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Environment variable for email user
      pass: process.env.EMAIL_PASS  // Environment variable for email password
    }
  },
  verifyMailOptions: {
    from: 'Do Not Reply <no-reply@yourapp.com>',
    subject: 'Please confirm your account',
    html: 'Click the following link to confirm your account: <a href="${URL}">${URL}</a>',
    text: 'Please confirm your account by clicking the following link: ${URL}'
  }
}, (err) => {
  if (err) console.error('Error setting up email verification:', err);
});

// Automatically generate the TempUser model based on User
nev.generateTempUserModel(User, (err, tempUserModel) => {
  if (err) {
      console.error('Error generating temporary user model:', err);
  } else {
      console.log('Temporary user model generated successfully.');
      console.log(tempUserModel);
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const tempUsers = await mongoose.connection.db.collection("temp_users").find({}).toArray();
    res.status(200).json({ tempUsers });
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err });
  }
});


// Set up authentication routes
app.use('/api/auth', authRoutes);

// Additional routes (if needed) would be added here

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
