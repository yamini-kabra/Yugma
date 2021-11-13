const express = require('express');
const path = require('path');
const rootDir = require('../util/path.js');
const router = express.Router();
const userController = require('../controllers/user');

router.use('/', userController.addUser);

module.exports = router;