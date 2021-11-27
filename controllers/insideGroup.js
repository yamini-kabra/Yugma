const events = require("../models/events");
const express = require("express");
const app = express();

const session = require("express-session");

exports.getEvents = (req,res,next) =>{

};

exports.postEvents = (req,res,next) =>{
  console.log(req.body.eventdate);
  const Event = new events({
    code: req.session.code,
    name: req.body.eventname,
    date: req.body.eventdate,
    url: req.body.eventurl,
    username: req.session.user.username
  });
  Event
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
    console.log("an event is added");
  return res.redirect("/groups/group/?code=" + req.session.code);
};