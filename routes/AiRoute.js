const {GoogleGenerativeAI} =  require("@google/generative-ai");

const supabase = require("../utils/supabase");
const {embedText} = require("../utils/embeddings");

const router = require("express").Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro"});

router.post('/', async (req, res) => {
    try{
        const { content } = req.body

        const emb = await embedText(content)
        const retrivels = await supabase.rpc("match_documents",{
          query_embedding:emb,
          match_threshold:0.5,
          match_count:1
        })
      
        const context = retrivels?.data.length > 0 ? retrivels.data[0].text : null

        if(context !== null && content !== ''){
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
        else{
          const result = await model.generateContentStream(content);
      
          let text = '';
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += chunkText;
            res.write(chunkText)
          }

          res.end()
        }
      }
      catch(err) {
        console.error(err)
        return res.status(400).send('server error');
      }
});

module.exports = router