import mongoose from "mongoose";
const dbConnect = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect("mongodb+srv://yash_patel:yash123@cluster0.ixk3sxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`MongoDB connected: ${(await conn).connection.host}`);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default dbConnect 