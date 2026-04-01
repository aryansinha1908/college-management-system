const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: function() {
            return !this.email; 
        }
    },
    email: {
        type: String,
        required: function() {
            return !this.userId;
        }
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
