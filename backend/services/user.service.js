const User = require("../models/user.model");

exports.updateProfile = async (userId, updateData) => {
    const updated = await User.findOneAndUpdate( { _id:userId }, {$set: { ...updateData }}, { new: true });

    if (!updated) {
        throw new Error("Failed to Update User");
    }

    return {
        updatedUser: updated
    };
}
