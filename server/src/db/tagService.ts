import mongoose from 'mongoose';
import Tag, { ITag } from './tagDB.js'; // Import the Tag model
import Transaction from './transactionDB.js';

// Function to add a new tag
export const addTag = async (transactionId: string, name: string, color: string): Promise<ITag> => {
    try {
        // 🔹 Validate if transaction exists before proceeding
        const transactionExists = await Transaction.findById(transactionId);
        if (!transactionExists) {
            throw new Error('User does not exist');
        }
        
        const newTag = new Tag({ transactionId, name, color });
        await newTag.save();
        console.log('Tag added successfully:', newTag);
        return newTag;
    } 
    catch (err) {
        console.error('Error adding tag:', err);
        throw err;
    }
};

// Function to get all tags
export const getAllTags = async (transactionId: string): Promise<ITag[]> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            throw new Error('Invalid user ID format');
        }
        
        const tags = await Tag.find({ transactionId }).populate('transactionId'); // Fetch all tags
        console.log('Tags retrieved:', tags);
        return tags;
    } 
    catch (err) {
        console.error('Error retrieving tags:', err);
        throw err;
    }
};

// Function to edit a tag
export const editTag = async (id: string, name?: string, color?: string): Promise<ITag | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid tag ID format');
        }

        const updatedFields: Partial<ITag> = {};
        
        if (name) updatedFields.name = name;
        if (color) updatedFields.color = color;

        const updatedTag = await Tag.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedTag) {
            console.log('No tag with the ID found.');
            return null;
        }

        console.log('Tag updated successfully:', updatedTag);
        return updatedTag;
    } 
    catch (err) {
        console.error('Error updating tag:', err);
        throw err;
    }
};

// Function to delete a tag
export const deleteTag = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid tag ID');
        }
        const result = await Tag.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            console.log('Tag deleted successfully.');
        } else {
            console.log('No tag found.');
        }
        return result;
    } 
    catch (err) {
        console.error('Error deleting tag:', err);
        throw err;
    }
};
