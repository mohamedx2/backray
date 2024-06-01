const {GoogleGenerativeAI} =  require("@google/generative-ai");
const {extractTextFromPdf} = require('../utils/PdfTextExtractor');
const path = require('path');

const router = require("express").Router();

require('dotenv').config()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro"});

let context = ''

extractTextFromPdf(path.join(__dirname + "/../files/AIDA.pdf"))
  .then((text) => context += "\n" + "source: AIDA.pdf" + "\n" + text)
  .catch((error) => console.error(error));

extractTextFromPdf(path.join(__dirname + "/../files/Nhi2 Mappe (2024)-1.pdf"))
  .then((text) => context += "\n" + "source: Nhi2 Mappe (2024)-1.pdf" + "\n" + text)
  .catch((error) => console.error(error));

router.post('/', async (req, res) => {
    try{
        const { content } = req.body
        console.log(context)
        const prompt = `${context !== ''? "\nanswer the question only based on the text: " + context + "\n":""}${context !== ''? "question: " + content:content}`
    
        const result = await model.generateContentStream(prompt);
    
        let text = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          text += chunkText;
          res.write(chunkText)
        }
    
        res.end()
      }
      catch(err) {
        console.error(err)
        return res.status(400).send('server error');
      }
});

module.exports = router