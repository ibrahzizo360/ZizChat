import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined.');
        }


        await mongoose.connect(process.env.MONGO_URI);

        const conn = mongoose.connection;
        console.log(`MongoDB Connected: ${conn.host}:${conn.port}`);
    } catch (error) {
        const errorMessage = (error as Error).message; // Type assertion
        console.error(`Error: ${errorMessage}`);
        process.exit(1);
    }
};

export default connectDB;
