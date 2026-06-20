const dns = require("dns");
const mongoose = require("mongoose");

const connectDb = async () => {

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("몽고DB 연결됨");
  } 
  
  catch (error) {
    console.log("몽고DB 연결 실패 :", error.message);
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDb;