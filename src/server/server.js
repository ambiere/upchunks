const express = require("express");
const dotenv = require("dotenv");
const compression = require("compression");
const pinoHttp = require("pino-http");
const cors = require("cors");
const index = require("./routes/index");
const filedata = require("./routes/upchunks");
const pkg = require("../../package.json");
const routeNotFound = require("./middleware/routeNotFound");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const loggerOptions = require("./config/loggerOptions");

dotenv.config();

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ ...loggerOptions }));

app.get("/", async (req, res) => res.json({ root: true }));
app.get(`/v${pkg.version.at(0)}/api/assets/:file`, async (req, res) =>
  res.sendFile(path.join(__dirname, "../../", `public/assets/${req.params.file}`))
);
app.get(`/v${pkg.version.at(0)}/api/version`, async (req, res) => res.json({ version: pkg.version.at(0) }));
app.use(`/v${pkg.version.at(0)}/api/upchunks`, filedata);
app.use(`/v${pkg.version.at(0)}/api/`, index);

app.use(routeNotFound);
app.use(errorHandler);
module.exports = app;
