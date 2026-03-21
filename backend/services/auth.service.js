const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (user) => {
    const token = jwt.sign({
        userId: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '15d'});
    return token;
}

const loginUser = async (rollno, password) => {
    const user = await User.findOne({ rollno });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }
    if (!user.isVerified){
        throw new Error("Please verify your email");
    }
    if (user.twoFactorEnabled) {
        return {
            requiresTwoFactor: true,
            userId: user._id,
            message: "Please complete 2FA process"
        };
    }
    
    const acessToken = generateToken(user); 

    return {
        requiresTwoFactor: false,
        accessToken,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    };
}

module.exports = loginUser;
