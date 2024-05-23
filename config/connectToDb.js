const mongoose= require("mongoose");


//connecte server with mongodb 

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to mongoDB ^_^ ");
  } catch (error) {
    console.log("Connection Failed To MongoDB",error)
  }
}