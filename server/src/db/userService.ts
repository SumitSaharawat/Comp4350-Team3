import User, {IUser} from './userDB.js'; // Import the User model

// Function to add a new user
export const addUser = async (username: string, password: string): Promise<IUser> => {
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

export const getAllUsers = async () => {
    try {
        const users = await User.find({}); // Fetch all users
        console.log('Users retrieved:', users);
        return users;
    } catch (err) {
        console.error('Error retrieving users:', err);
        throw err;
    }
};

// Function to delete a user by username
export const deleteUser = async (username: string) => {
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
