import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface IReminder extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    text: string;
    time: Date;
}

const reminderSchema = new Schema<IReminder>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'Invalid user ID format',
            },
        },
        name: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true,
            validate: {
                validator: (value: Date) => value instanceof Date && !isNaN(value.getTime()),
                message: 'Invalid date format',
            },
        },
    },
    { strict: 'throw' }
);

const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);
export default Reminder;
