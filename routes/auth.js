const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const user = require('../models/user');
const { check, body } = require("express-validator");

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);
router.post('/signup',[
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then((newUser) => {
          if (newUser) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with at least 5 characters."
    ).isLength({ min: 5 }),
    body("cpassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
    body("username", "Please enter a valid username with only numbers and text")
      .isLength({ min: 1 })
      .isAlphanumeric(),
  ], authController.postSignup);

router.get("/logout",authController.getLogout);
router.get("/delete",authController.deleteAccount);
router.get('/', authController.getLandingPage);
module.exports = router;


