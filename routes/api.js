const { Router } = require("express");

const router = Router();

const apiController = require("../controllers/api");

router.get("/blog-stats", apiController.blogStats);

module.exports = router;