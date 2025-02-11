import User from './src/db/userDB.js'; // Import the User model


// Function to add a new user
export const addUser = async (username, password) => {
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        console.log('User added successfully:', newUser);
        return newUser;
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};


// Function to delete a user by username
export const deleteUser = async (username) => {
    try {
        const result = await User.deleteOne({ username });
        if (result.deletedCount > 0) {
            console.log('User deleted successfully.');
        } else {
            console.log('No user found with the given username.');
        }
        return result;
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};
