require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const db = require("./config/db");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

