const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const cookieParser = require("cookie-parser");
const config = require("./config/auth.config");
const jwt = require("express-jwt");
const csrf = require("csurf");

const allowedOrigins = ["http://localhost:5238"];
const csrfProtection = csrf({
    cookie: true,
});

const app = express();
app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                let msg = "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }

            return callback(null, true);
        },
    })
);

app.use(cookieParser());
app.use(
    jwt({
        secret: config.secret,
        getToken: (req) => req.cookies.token,
        algorithms: ["HS256"],
    }).unless({
        path: [
            "/api/profiles",
            "/api/profile/create",
            "/api/profile/choose",
            "/api/profile/emailCheck",
            "/api/profile/logout",
        ],
    })
);
app.use(csrfProtection);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

require("./routes/auth.routes")(app);

const PORT = process.env.PORT || 5328;
app.listen(PORT, () => {
    console.log(`LIVE ON ${PORT}`);
});
