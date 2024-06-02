const express = require("express");
const connectToDb = require("./config/connectToDb");
const tokenProvider = require("./config/tokenprovider");
const cors = require('cors');
const { User } = require("./models/user");
require("dotenv").config();
const locationsRouter = require('./routes/loucationsRoute');
const workplacesRouter = require('./routes/workPlaceRoute');
const shiftsRouter = require('./routes/shiftsRoute');

const {FileEmbedding, embedText, mergeAndRemoveSimilar} = require('./utils/embeddings')

// Connect to database
connectToDb();

// Initialize the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/ai", require("./routes/AiRoute"));
app.use('/api/calendar', require('./routes/callenderRoute'));
app.use('/api/mail', require('./routes/mailRoute'));
app.use('/api/chat', require('./routes/chatRoute'));
app.use('/api/locations', locationsRouter);
app.use('/api/workplaces', workplacesRouter);
app.use('/api/shifts', shiftsRouter);
//app.use('/api/calendar', require('./routes/callenderRoute'));


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

// el code hadha just 3maltou bech n7ot el pdf fel data base bark mosta9balan nwali nrak7ou bech kan el admin zad pdf yet7at fel database

// const {PDFLoader} = require("@langchain/community/document_loaders/fs/pdf");
// const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter");
// const supabase = require("./utils/supabase");

// const fs = require('fs');

// app.get('/vectorize', async (req, res) => {
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 2000,
//     chunkOverlap: 350,
//   });
  
//   const folder = "./files"
//   const dirContents = fs.readdirSync(folder);

//   for (const file of dirContents) {
//     const loader = new PDFLoader(folder+"/"+file);

//     const docs = await loader.load();

//     const chunks = await splitter.splitDocuments(docs);

//     await FileEmbedding(chunks)
//   }

//   res.send("ok")
// })


// Running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
