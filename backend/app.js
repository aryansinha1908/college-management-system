const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const assignmentRouter = require("./routes/assignment.routes");
const attendanceRouter = require("./routes/attendance.routes");
const courseRouter = require("./routes/course.routes");
const enrollmentRouter = require("./routes/enrollment.routes");
const gradeRouter = require("./routes/grade.routes");
const submissionRouter = require("./routes/enrollment.routes");
const userRouter = require("./routes/user.routes");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Version 1 of API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/assignments", assignmentRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use("/api/v1/grades", gradeRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
