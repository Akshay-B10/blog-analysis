const { Router } = require("express");

const router = Router();

const apiController = require("../controllers/api");

router.get("/blog-stats", apiController.blogStats);

router.get("/blog-search", apiController.blogSearch);

module.exports = router;