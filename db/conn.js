//db/conn.js
import mongoose from "mongoose";

const connectionString = "mongodb+srv://zesemy:Heran%402023@mongopractice.7e8lj.mongodb.net/";

const db = async () => {
  try {
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
   
  }
};

export default db;