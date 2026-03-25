const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const PasswordToken = require('../models/passwordToken.model');
const RefreshToken = require('../models/refreshToken.model');
const hashUtils = require('../utils/hash');

const generateAccessToken= (user) => {
    const token = jwt.sign({
        userId: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '30m'});
    // console.log("AccessToken generated");
    return token;
}

const generateRefreshToken= (user) => {
    const token = jwt.sign({
        userId: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '7d'});
    // console.log("RefreshToken generated");
    return token;
}

const generatePasswordToken = (user) => {
    const token = jwt.sign({
        userId: user._id,
        purpose: "set-password"
    }, process.env.JWT_SECRET, {expiresIn: '14d'});
    console.log("PasswordToken generated: ", token);
    return token;
}

exports.register = async (data) => {
    // console.log("authService.register Start");
    // console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // console.log(hashedPassword);
    
    const exists = await User.findOne({ email: data.email });
    // console.log("User checked");

    if (exists) {
        throw new Error("User Already Exists");
    }

    data.password = hashedPassword;
    data.isVerified = false;
    data.twoFactorEnabled = false;

    const registered = await User.create(data);
    const cleanUser = registered.toObject();

    // console.log(cleanUser);
    if (!registered) {
        throw new Error("Failed to Create User");
    }

    // console.log(String(cleanUser._id));
    const hashedToken = await hashUtils.hashToken(generatePasswordToken(cleanUser));
    // const hashedToken = generatePasswordToken(cleanUser);
    // console.log(hashedToken);

    const passwordToken = await PasswordToken.create({
        userId: cleanUser._id.toString(),
        token: hashedToken,
        expiresAt: new Date(Date.now() + 1000*60*60*24*15)
    });

    // console.log("User has been created");
    // console.log("authService.register End")

    return {
        newUser: registered,
        passwordToken: passwordToken
    }
}

exports.loginUser = async (rollno, password) => {
    // console.log("Start of authService.login");
    const user = await User.findOne({ rollno: rollno });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    // console.log("User exists");
    // console.log(user.password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log(isValidPassword);

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

    // console.log("authService.login Validates");
    
    const refreshToken = await RefreshToken.create({
        userId: user._id,
        token: generateRefreshToken(user),
        expiresAt: new Date(Date.now() + 1000*60*60*24*7)
    });
    const accessToken = generateAccessToken(user);

    return {
        requiresTwoFactor: false,
        accessToken: accessToken,
        refreshToken: refreshToken.token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    };
}

exports.logout = async (refreshToken) => {
    const token = await RefreshToken.deleteOne({ token: refreshToken });

}

exports.setPassword = async (token, password) => {
    token = hashUtils.hashToken(token);
    console.log(token);
    const passwordToken = await PasswordToken.findOne({ token: token });

    console.log(passwordToken);

    if (!passwordToken || !passwordToken.userId) {
        throw new Error("Invalid Token");
    }

    const user = await User.findOne( {_id: passwordToken.userId });

    if (!user) {
        throw new Error("User does not Exist");
    }

    if (user.isVerified === true) {
        throw new Error("User is already Registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await User.updateOne( {_id: passwordToken.userId }, { $set: {password: hashedPassword, isVerified: true} });
    const deleted = await PasswordToken.deleteOne( { _id: passwordToken._id});

    return {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    }
}

exports.resetToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decoded) {
        throw new Error("Invalid Token");
    }

    const token = await RefreshToken.findOne({ token : refreshToken });

    if (!token) {
        throw new Error("Invalid or expired Token");
    }

    if (token.expiresAt.getTime() < Date.now()) {
        throw new Error("Invalid or expired Token");
    }

    const user = await User.findOne({ _id: token.userId });

    if (!user) {
        throw new Error("Invalid or expired Token");
    }

    const newAccessToken = generateAccessToken(user);

    const deletedRefreshToken = await RefreshToken.deleteMany({ userId: user._id });

    const newRefreshToken = await RefreshToken.create({
        userId: user._id,
        token: generateRefreshToken(user),
        expiresAt: new Date(Date.now() + 1000*60*60*24*7)
    });

    return {
        newAccessToken: newAccessToken || undefined,
        newRefreshToken: newRefreshToken.token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    }
}
