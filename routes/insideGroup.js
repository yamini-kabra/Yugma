const express = require("express");

const router = express.Router();

const insideGroupController = require('../controllers/insideGroup');

router.post("/group/events" , insideGroupController.postEvents);

module.exports = router;