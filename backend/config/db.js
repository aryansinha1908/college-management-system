const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");
        console.log("Host: ", conn.connection.host);
    } catch (error) {
        console.error("DB could not connect ", error.message);
    }
}

module.exports = connectToDB;
