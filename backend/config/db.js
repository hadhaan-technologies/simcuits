import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db connected Succesfully")
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
};
