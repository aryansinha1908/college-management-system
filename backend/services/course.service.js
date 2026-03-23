const Course = require("../models/course.model");

exports.createCourse = async (data) => {
    const course = await Course.findOne({ code: data.code });

    if (course) {
        throw new Error("The course already exist");
    }

    const createdCourse = await Course.create(data);

    return createdCourse;
}

exports.showCourse = async (code) => {
    const course = await Course.findOne({ code: code})

    if (!course) {
        throw new Error("Course Not Found");
    }

    return course;
}

exports.updateCourse = async (code, userId, data) => {
    const updatedCourse = await Course.findOneAndUpdate(
        { code: code, professorId: userId },
        { $set: data },
        { new: true}
    )

    if (!updatedCourse) {
        throw new Error("Course does not Exist");
    }

    return updatedCourse;
}

exports.deleteCourse = async (code, userId) => {
    const deletedCourse = await Course.findOneAndDelete(
        { code: code, professorId: userId},
        { $set: data},
        { new: true}
    )

    if (!deletedCourse) {
        throw new Error("Course does not Exist");
    }

    return deletedCourse;
}
