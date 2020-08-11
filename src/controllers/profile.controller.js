const config = require("../config/auth.config");
const db = require("../models");
const Profile = db.profiles;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const types = require("./types");

function isEmpty(o) {
    for (let key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            return false;
        }
    }
    return true;
}

exports.create = (req, res) => {
    const profile = new Profile({
        fullname: req.body.fullname,
        email: req.body.email,
        private: req.body.private,
    });

    if (req.body.password && req.body.private) {
        profile.password = bcrypt.hashSync(req.body.password, 8);
    }

    profile.save((err) => {
        if (err) {
            res.status(500).send({ status: types.ERROR, message: err });
            return;
        }
        res.send({ status: types.SUCCESS, message: "Profile was registered successfully" });
    });
};

exports.findAll = (req, res) => {
    Profile.find().then((data) => {
        if (isEmpty(data)) {
            res.status(200).send({ message: "Not found any profile.", data });
        } else {
            let profiles = data.map((d) => ({
                id: d._id,
                fullname: d.fullname,
                email: d.email,
                private: d.private,
            }));

            res.send({ message: "Found.", data: profiles });
        }
    });
};

exports.chooseProfile = (req, res) => {
    Profile.findOne({
        email: req.body.email,
    }).exec((err, profile) => {
        if (err) {
            res.status(500).send({ status: types.ERROR, message: err });
        }

        if (profile.private) {
            if (req.body.password) {
                let passwordIsValid = bcrypt.compareSync(req.body.password, profile.password);

                if (!passwordIsValid) {
                    return res.status(401).send({
                        message: "Invalid password!",
                    });
                }
            } else {
                return res.status(400).send({ message: "Please enter password." });
            }
        }

        let token = jwt.sign({ id: profile.id }, config.secret, {
            expiresIn: 864000000,
        });

        res.cookie("token", token, { httpOnly: true, maxAge: 864000000 });

        res.status(200).send({
            id: profile._id,
            fullname: profile.fullname,
            email: profile.email,
        });
    });
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).send({ message: "Loggout successfully." });
};
