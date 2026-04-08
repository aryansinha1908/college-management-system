const Test = require("../models/test.model");

exports.getTestById = async (id) => {

    const test = await Test.findOne({ _id: id });

    return test;
}

exports.getTestByCreatedBy = async (createdBy) => {

    const tests = await Test.find({ createdBy: createdBy });

    return tests;
}

exports.getTestByCourseId = async (courseId) => {

    const tests = await Test.find({ courseId: courseId });

    return tests;
}

exports.createTest = async (title, createdBy, maximumMarks, questions, courseId) => {

    console.log("Meow");
    const test = await Test.create({
        title,
        createdBy,
        maximumMarks,
        questions,
        courseId
    });
    console.log(test);

    if (!test) {
        throw new Error("Test Could Not be Created");
    } 

    return test;
}

exports.updateTest = async (data, id) => {

    const updated = await Test.findOneAndUpdate({ _id: id }, data, { upserts: true }, { new: true });

    return updated;
}

exports.deleteTest = async (id) => {

    const test = await Test.findOneAndDelete({ _id: id });

    return test;
}