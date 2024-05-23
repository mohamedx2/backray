const express = require("express");
const connectToDb = require("./config/connectToDb");
const tokenProvider = require("./config/tokenprovider");
const cors = require('cors');
const { User } = require("./models/user");
require("dotenv").config();

// Connect to database
connectToDb();

// Initialize the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));



// Generate token route
app.post('/stream-token', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate a token for the user
    const token = await tokenProvider(userId);
    console.log('token generated succressfully :)');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
  }
});


// Running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
