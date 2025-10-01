import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = () => {
    try {
        mongoose.connect(process.env.CONNECTION_STRING);
        const connect = mongoose.connection;
        connect.on('connected', () => {
            console.log('mongo db connected');
        });
        connect.on('err', (err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error)
    }
}
export default connectDB;