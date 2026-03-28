const User = require("../models/user.model");

exports.showUser = async (userId) => {
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new Error("Failed to Find User");
    }

    return user;
}
exports.showUsers = async () => {
    const users = await User.find();

    if (!users) {
        throw new Error("Failed to Find Users");
    }

    return users;
}

exports.showProfile = async (userId) => {
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new Error("Failed to Find User");
    }

    return user;
}

exports.updateProfile = async (userId, updateData) => {
    const updated = await User.findOneAndUpdate( { _id:userId }, {$set: { ...updateData }}, { new: true });

    if (!updated) {
        throw new Error("Failed to Update User");
    }

    return updated;
}

exports.deleteUser = async (userId) => {
    // console.log("userService.deleteUser Start");
    const deleted = await User.findOneAndDelete({ _id: userId });
    // console.log(deleted);
    // console.log("User found and deleted")

    if (!deleted) {
        throw new Error("Failed to Delete User");
    }

    return deleted;
}
