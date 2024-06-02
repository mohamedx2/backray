const supabase = require("./supabase");
const {GoogleGenerativeAI, TaskType} =  require("@google/generative-ai");

//	models/text-embedding-004
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/text-embedding-004"});

async function embedText(text) {
    const response = await model.embedContent(text);

    return response.embedding.values
}

async function FileEmbedding(data) {
    try{
        const batch = data.map(d=>{
            return{
                content:{
                    role:"",
                    parts:[{text:d.pageContent}]
                }, 
                taskType:TaskType.RETRIEVAL_QUERY
            }
        });
        const response = await model.batchEmbedContents({
            requests: batch
        });
        
        const vector_store = response.embeddings.map((emb, index)=>{
            return{
                text:data[index].pageContent,
                embedding: emb.values,
                metadata: {source:data[index].metadata.source, page:data[index].metadata.loc.pageNumber}
            }
        })

        const r = await supabase.from("vector_store").insert(vector_store)
    }
    catch(err) {
        console.error(err)
        throw Error("embedding error")
    }
}

module.exports = {FileEmbedding, embedText}