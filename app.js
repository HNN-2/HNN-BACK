const express = require("express");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");

const indexRouter = require("./routes");
const { error404, error } = require("./middlewares/error");
const cors = require("cors");

// const app = express();
// const port = 3000;

// app.listen(port, () => {
//     console.log(port, "서버켜짐!");
// });

// sequelize.sync({ force: true });

class App {
    constructor() {
        this.app = express();
        this.setMiddleWare();
        this.setRouter();
        // this.setErrorHandler();
    }
    setMiddleWare() {
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
    setRouter() {
        this.app.use("/", indexRouter);
    }
    setErrorHandler() {
        this.app.use(error404);
        this.app.use(error);
    }
}
module.exports = new App().app;
