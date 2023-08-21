const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/winston.util");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const ejsLayouts = require("express-ejs-layouts");
const { sendResponse } = require("./helpers/requestHandler.helper");
const fileupload = require("express-fileupload");
require("./utils/db-connection.util");

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    createParentPath: true,
  })
);

const sessions = require("express-session");
// app.use(ejsLayouts)
app.use(express.static(path.join(__dirname, "public")));

//Route files
const authRouter = require("./routes/auth-router");
const adminRouter = require("./routes/admin-router");
const uploadRouter = require("./routes/upload-router");

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/", adminRouter);
app.use("/upload", uploadRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load("./documentation/swagger.yaml"))
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  logger.error(
    `${err.status || 500} | ${err.message} | ${req.originalUrl} | ${
      req.method
    } | ${req.ip}`
  );
  return sendResponse(res, false, err.status || 500, "Internal server error.");
});

module.exports = app;
