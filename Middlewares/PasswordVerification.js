import bcrypt from 'bcrypt';
export const ComparePassword = async (EnteredPassword, SavedPassword) => {
    return await bcrypt.compare(EnteredPassword, SavedPassword);
}