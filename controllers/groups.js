const userGroups = require('../models/userGroups');


exports.groupsLandingPage = (req,res,next) =>{
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    userGroups.find({ email: req.session.user.email })
      .then((channels) => {
        console.log(channels);
        return res.render("channels", {
          channels: channels,
          username: req.session.user.username,
          errorMessage: message,
        });
      });
    //return res.redirect("/channels");
  };