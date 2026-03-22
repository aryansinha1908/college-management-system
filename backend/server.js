require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectToDB = require("./config/db");
const PORT = process.env.PORT || 3000;

connectToDB().then(() => {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("Server mongoose:", mongoose.connection.readyState);
    console.log("DB Name:", mongoose.connection.name);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch ((err) => {
    console.error("Failed to connect to DB: ", err);
})

