const cookie = require('cookie-parser');
const mongoose = require('mongoose');
const userService = require("../services/user.service");

exports.showProfile = async (req, res, next) => {
    try {
        const user = req.user;

        const data = await userService.showProfile(user.userId);
        // console.log(user);

        return res.status(200).json({
            success: true,
            message: "User Found",
            user: data
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "User Not Found",
            error: error
        });
    }
}

exports.showUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await userService.showUser(userId);

        return res.status(200).json({
            success: true,
            message: "User Found",
            user: user
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "User Not Found",
            error: error
        });
    }
}

exports.showUsers = async (req, res, next) => {
    try {
        const users = await userService.showUsers();

        return res.status(200).json({
            success: true,
            message: "User Found",
            users: users
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Users Not Found",
            error: error
        });
    }
}

exports.showStudents = async (req, res, next) => {
    try {
        const students = await userService.showStudents();

        return res.status(200).json({
            success: true,
            message: "Students Found",
            students: students
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Students Not Found",
            error: error.message
        });
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const updateData = req.body;
        const userId = req.params.id;

        if (updateData.email || updateData.password) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        const updated = await userService.updateProfile(userId, updateData);

        return res.status(200).json({
            success: true,
            updatedUser: updated,
            message: "User Updated Successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Update User",
            error: error
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    try{
        const userId = req.params.id;

        const objectId = new mongoose.Types.ObjectId(userId);
        // console.log(objectId);

        const deleted = await userService.deleteUser(objectId);

        return res.status(200).json({
            success:true,
            message: "User Deleted Successfully",
            deletedUser: deleted
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to Delete User",
            error: error
        });
    }
}
