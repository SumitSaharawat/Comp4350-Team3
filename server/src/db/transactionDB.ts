import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface ITag {
    name: string;
    color: string; //hex code
}

export interface ITransaction extends Document {
    user: mongoose.Schema.Types.ObjectId;
    date: Date;
    amount: number;
    currency: string;
    tag: ITag
}

// Define the schema for tags
const tagSchema = new Schema<ITag>({
    name: { 
            type: String, 
            required: [true, "Tag is required"]
        },
    color: {
        type: String, 
        required: true, match: /^#([0-9A-Fa-f]{6})$/
        }
});


// Define the schema for the transaction
const transactionSchema = new Schema<ITransaction>({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        validate: {
            validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
            message: "Invalid user ID format"
        }

    },
    date: { 
        type: Date, 
        required: true,
        validate: {
            validator: (value: Date) => value instanceof Date && !isNaN(value.getTime()),
            message: "Invalid date format"
        }
     },
    amount: { 
        type: Number, 
        required: true,
        min: [0, "Amount must be a positive number"]
     },
    currency: { 
        type: String, 
        required: true,
        match: [/^[A-Z]{3}$/, "Invalid currency format (e.g., CAD)"],
     },
    tag: { 
        type: tagSchema, 
        required: false, 
        default: { name: "null", color: "#000000" } 
    }, 
},
{strict: 'throw'}

);

// Create the Mongoose model for transactions
const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;

