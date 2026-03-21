const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const assignmentRouter = require("./routes/assignment.routes");
const attendanceRouter = require("./routes/attendance.routes");
const courseRouter = require("./routes/course.routes");
const enrollmentRouter = require("./routes/enrollment.routes");
const gradeRouter = require("./routes/grade.routes");
const submissionRouter = require("./routes/enrollment.routes");
const userRouter = require("./routes/user.routes");

app.use(express.json());


// Version 1 of API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/assignment", assignmentRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/grade", gradeRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/user", userRouter);

module.exports = app;
