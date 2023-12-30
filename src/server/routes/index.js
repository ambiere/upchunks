"use strict";

const { Router } = require("express");
const path = require("path");
const router = Router({ strict: true });

router.get("/upchunks", async (req, res) => res.sendFile(path.join(__dirname, "../../../", "public/")));

module.exports = router;
