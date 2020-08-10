const { verifySignup } = require("../middlewares");
const controller = require("../controllers/profile.controller");

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/profiles", controller.findAll);
    app.post("/api/profile/create", [verifySignup.checkDuplicateEmail], controller.create);
    app.post("/api/profile/choose", controller.chooseProfile);
};
