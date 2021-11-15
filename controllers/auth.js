const bcrypt = require('bcryptjs');
const user = require('../models/user');
const { validationResult } = require("express-validator");
const config = require('../config');
const nodemailer = require("nodemailer");
const flash = require("connect-flash");

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    // let message = false;
    res.render("./auth/signup", {
      errorMessage: message,
    });
};

exports.getLogin = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    // let message = false;
    res.render("./auth/login", {
      errorMessage: message,
    });
  };

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    user.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "You don't have an account, create one!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save((err) => {
            
              if (err) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
              }
              res.redirect("/groups");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req,res,next)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const cpassword = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("./auth/signup", {
        errorMessage: errors.array()[0].msg,
        });
    }
    user.findOne({email : email}).then(oneuser => {
        if(oneuser)
        {
            req.flash('error' , 'E-mail already exists');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12).then(hashedp => {
            const newUser = new user({email:email , password:hashedp, username: username});
            return newUser.save();
        }).then(()=>{
            res.redirect("/login");
        });
    }).catch(err => console.log(err));
    
};
           
  exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/login");
    });
  };

  exports.deleteAccount = (req, res, next) => {
    const email = req.session.user.email;
    user.deleteOne({ email: email }, function (err, obj) {
      if (err) throw err;
    });
    res.redirect("/login");
  };
  