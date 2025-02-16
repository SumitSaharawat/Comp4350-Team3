import mongoose from 'mongoose';

const dbURI = 'mongodb+srv://comp4350:qwer@simplefinance.sjbyl.mongodb.net/SimpleFinance?retryWrites=true&w=majority&appName=SimpleFinance';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to DB');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process on failure
    }
};


export default connectDB;
