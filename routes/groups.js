const express = require('express');
const { check, body } = require("express-validator");
const groupController = require('../controllers/groups');
const forAuth = require('../middleware/for-auth');

const router = express.Router();

router.get('/groups', forAuth, groupController.groupsLandingPage);

router.post("/createGroup", groupController.createGroup);

router.post("/joinGroup", [body("code", "Please Enter a code").isLength({ min: 1 })], groupController.joinGroup );

router.get("/group", groupController.getGroup);

router.get("/leaveGroup", groupController.leaveGroup);

module.exports = router;

