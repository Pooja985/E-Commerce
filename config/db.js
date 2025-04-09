import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(colors.green(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(error.red);
  }
};

export default connectDB;
