const db = require("../models");
const Profile = db.profiles;
const types = require("../controllers/types");

checkDuplicateEmail = (req, res, next) => {
    Profile.findOne({
        email: req.body.email,
    }).exec((err, profile) => {
        if (err) {
            res.status(500).send({ status: types.ERROR, message: err });
            return;
        }

        if (profile) {
            res.status(400).send({ status: types.ERROR, message: "Email is already in use!" });
            return;
        }

        next();
    });
};

const verifySignup = {
    checkDuplicateEmail,
};

module.exports = verifySignup;
