const mongoose = require("mongoose");

const passwordTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    }
});

const PasswordToken = mongoose.model('PasswordToken', passwordTokenSchema);
module.exports = PasswordToken;
