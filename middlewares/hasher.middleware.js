import bcrypt from "bcrypt";

export const hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

export const comparePasswords = async function(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};