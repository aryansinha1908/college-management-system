const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodemailerHelper = require('nodemailer-otp');
const User = require('../models/user.model');
const PasswordToken = require('../models/passwordToken.model');
const RefreshToken = require('../models/refreshToken.model');
const Otp = require('../models/otp.model');
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
    // console.log("PasswordToken generated: ", token);
    return token;
}

exports.register = async (data) => {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
        throw new Error("User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;
    data.isVerified = false;
    data.twoFactorEnabled = false;

    // console.log(data);
    const registered = await User.create({
        ...data,
        password: hashedPassword,
        isVerified: false,
        twoFactorEnabled: false,
    });
    // console.log(registered);
    
    if (!registered) {
        throw new Error("Failed to Create User");
    }

    const cleanUser = registered.toObject();

    const token = generatePasswordToken(cleanUser);
    // console.log(token);
    const hashedToken = hashUtils.hashToken(token);
    // console.log(hashedToken);

    const passwordToken = await PasswordToken.create({
        userId: cleanUser._id.toString(),
        token: hashedToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
    });

    const helper = new NodemailerHelper(process.env.EMAIL_USER, process.env.EMAIL_PASS);
    
    try{
        helper.sendEmail(cleanUser.email, 'Verification Email','Please Verify your College Account: ', `http://localhost:5173/verification/${token}`);
    } catch (error) {
        throw new Error("Failed To Generate PasswordToken");
    }

    return {
        newUser: registered,
        passwordToken: passwordToken
    }
}

exports.loginUser = async (email, password, refreshToken) => {
    // console.log("Start of authService.login");
    const user = await User.findOne({ email: email });

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

    if (!user.twoFactorEnabled && !refreshToken) {
        const accessToken = generateAccessToken(user);

        return {
            accessToken: accessToken,
            refreshToken: null,
            twoFactorEnabled: false,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }

    if (user.twoFactorEnabled && !refreshToken) {
        return {
            accessToken: null,
            refreshToken: null,
            twoFactorEnabled: true,
            user: { _id: user._id, email: user.email }
        }
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decoded) {
        throw new Error("Invalid Token");
    }

    const existingRefreshToken = await RefreshToken.findOne({ userId: user._id });

    if (!existingRefreshToken) {
        return {
            accessToken: null,
            refreshToken: null,
            twoFactorEnabled: true,
            user: { _id: user._id, email: user.email }
        }
    }

    return {
        accessToken: generateAccessToken(user),
        refreshToken: existingRefreshToken.token || null,
        twoFactorEnabled: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    };
}

exports.logout = async (refreshToken) => {
    const token = await RefreshToken.deleteMany({ token: refreshToken });
    return;
}

exports.setPassword = async (token, password) => {
    token = hashUtils.hashToken(token);
    console.log(token);
    const passwordToken = await PasswordToken.findOne({ token: token });

    // console.log(passwordToken);

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

    const updated = await User.updateOne( {_id: passwordToken.userId }, { $set: {password: hashedPassword, isVerified: true, twoFactorEnabled: true} });
    const deleted = await PasswordToken.deleteOne( { _id: passwordToken._id});

    return {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    }
}

exports.sendOtp = async (userId, email) => {

    const helper = new NodemailerHelper(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    const otp = helper.generateOtp(6);

    const otpGenerated = await Otp.create({
        userId: userId,
        otp: hashUtils.hashToken(otp)
    });

    try{
        helper.sendEmail(email, 'OTP For Login','Enter the OTP on the Login Page', otp);
    } catch (error) {
        throw new Error("Failed to Generate OTP");
    }

    return otpGenerated;
}

exports.verifyOtp = async (userId, otp) => {

    const hashedOtp = hashUtils.hashToken(otp);
    //console.log(hashedOtp);

    const checked = await Otp.findOne({ otp: hashedOtp });
    const user = await User.findOne({ _id: userId });

    if (!checked) {
        throw new Error("Invalid OTP");
    }

    return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
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
