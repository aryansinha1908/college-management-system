const Grade = require("../models/grade.model");

exports.getGradeByTestId = async (id) => {

    const grade = await Grade.findOne({ testId: id });

    return grade || null;
}

exports.getGradeByStudentId = async (id) => {

    const grade = await Grade.findOne({ userId: id });

    return grade || null;
}

exports.createGrade = async (data) => {

    const grade = await Grade.create({
        userId: data.studentId,
        testId: data.testId,
        grade: data.grade,
        pass: (data.grade !== "F")
    });

    return grade;
}

exports.updateGrade = async (id, data) => {

    const grade = await Grade.findOneAndUpdate({ _id: id }, {
        grade: data.grade,
        pass: (data.grade !== "F")
    }, { new: true });

    return grade;
}

exports.deleteGrade = async (id) => {

    const grade = await Grade.findByIdAndDelete({ _id: id });

    return grade;
}