const cookie = require('cookie-parser');
const userService = require("../services/user.service");

exports.showProfile = async (req, res, next) => {
    const user = req.user;

    return user;
}

exports.updateProfile = async (req, res, next) => {
    try {
        const {userId, ...updateData} = req.body;

        const updated = await userService.updateProfile(userId, updateData);

        return res.status(200).json({
            success: true,
            updatedUser: updated,
            message: "User updated successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to update user",
            error: error
        })
    }
}
