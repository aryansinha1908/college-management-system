const cookie = require('cookie-parser');

exports.profile = async (req, res, next) => {
    const user = req.user;

    return user;
}
