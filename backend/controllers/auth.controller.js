const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    const { name, password } = req.body;
}

exports.login = async (req, res, next) => {
    try{
        const { rollno, password } = req.body;

        if (!rollno|| !password){
            return res.status(400).json({ message: "Roll number and Password are required" });
        }
        const result = await authService.loginUser(rollno, password);

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }
};
