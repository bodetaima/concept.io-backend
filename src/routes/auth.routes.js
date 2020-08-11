const { verifySignup } = require("../middlewares");
const controller = require("../controllers/profile.controller");

module.exports = (app) => {
    app.use(function (req, res, next) {
        var token = req.csrfToken();
        res.cookie("XSRF-TOKEN", token);
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/profiles", controller.findAll);
    app.post("/api/profile/create", [verifySignup.checkDuplicateEmail], controller.create);
    app.post("/api/profile/choose", controller.chooseProfile);
    app.post("/api/profile/logout", controller.logout);
};
