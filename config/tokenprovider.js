const { StreamClient } = require("@stream-io/node-sdk");
const { User } = require('../models/user'); // Import the User model
require('dotenv').config();


const STREAM_API_KEY = process.env.STREAM_API_KEY;;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

// Check if the API key and secret are set
if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error('STREAM_API_KEY and STREAM_API_SECRET must be set');
  process.exit(1);
}


client = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET, { timeout: 3000 });


const tokenProvider = async (userId) => {
  
  // Check if the user exists in the database
  //curl -X POST -H "Content-Type: application/json" -d '{"userId":"660c736cceffca5235ef0574"}' http://localhost:8000/stream-token
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;
  if (!user) throw new Error('User not found');
  if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const token = client.createToken(userId, exp, issued);

  return token;
};

module.exports = tokenProvider;
