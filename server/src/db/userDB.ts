import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;

// Define the interface for the User document
interface IUser extends Document {
    username: string;
    password: string;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
export {IUser};
