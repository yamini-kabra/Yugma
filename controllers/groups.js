const userGroups = require('../models/userGroups');
const groups = require('../models/groups');

exports.groupsLandingPage = (req,res,next) =>{
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    userGroups.find({ email: req.session.user.email })
      .then((groups) => {
        console.log(req.session.user.username);
        console.log(message);
        return res.render("groups", {
            clickOn : 'home',
          groups: groups,
          username: req.session.user.username,
          errorMessage: message,
        });
      });
    
  };
  exports.getCreateGroup = (req,res,next) =>{
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    userGroups.find({ email: req.session.user.email })
      .then((groups) => {
        console.log("current session username is " + req.session.user.username);
        return res.render("groups", {
            clickOn : 'createGroup',
          groups: groups,
          username: req.session.user.username,
          errorMessage: message,
        });
      });
    
  };
  exports.getJoinGroup = (req,res,next) =>{
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    userGroups.find({ email: req.session.user.email })
      .then((groups) => {
        console.log("current session username is " + req.session.user.username);
        return res.render("groups", {
            clickOn : 'joinGroup',
          groups: groups,
          username: req.session.user.username,
          errorMessage: message,
        });
      });
    
  };

  exports.postCreateGroup = (req,res,next) => {
    const code = req.body.code;
    const name = req.body.name;
    groups.findOne({ code: code }).then((group) => {
    if (!group) {
      const Group = new groups({
        code: code,
        name: name,
      });
      Group.save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      const UserGroup = new userGroups({
        email: req.session.user.email,
        code: code,
        name: name,
      });
      UserGroup.save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      req.flash("error", "Code already exists");
    return res.redirect("/createGroup");
    }
    return res.redirect("/groups");
  });

  };

  exports.postJoinGroup = (req,res,next) => {
    const code = req.body.code;
    groups.findOne({ code: code }).then((group) => {
      if (!group) 
      {
        req.flash("error", "No such group exists.");
        return res.redirect("/joinGroup");
      } else {
        const name = group.name;
        // to check that whether the user is already in the group or not
        userGroups.findOne({ email: req.session.user.email, code:code , name:name }).then((usergroup) => {
          if(!usergroup)
          {
            const userGroup = new userGroups({
                email: req.session.user.email,
                code: code,
                name: name,
              });
            userGroup
            .save()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
            return res.redirect("/groups");
          }
          else
          {
            req.flash("error", "Already in the group");
            return res.redirect("/joinGroup");
          }
        });  
      }
    });
  };

  exports.getGroup = (req, res, next) => {
    var code = req.query.code;
  
    console.log("code of the channel" + code);
    req.session.code = code;
    // let firstquery = new Promise((resolve, reject) => {
      userGroups.find({ code: req.session.code }).then((group) => {        
        req.session.groupName = group[0].name;
        console.log("hey");
        return res.render("insideGroup", {
          username: req.session.user.username,
          groupName: req.session.groupName
        });
      });
    // });
    console.log("groupNmae" + req.session.groupName);
   
    // let mytask = [];
    // eventDatabase.find({ code: req.session.code }).then((tasks) => {
    //   req.session.code = code;
    //   mytask = tasks;
    // });
  
    // ChannelNote.find({ code: code })
    //   .populate("noteId")
    //   .then((chn) => {
      
    //     return res.render("insideGroup", {
    //       // tasks: mytask,
    //       // username: req.session.user.username,
    //       groupName: req.session.channelName,
    //       // files: chn,
    //     });
    //   });
  };
  exports.leaveGroup = (req, res, next) => {
    const email = req.session.user.email;
    userGroups.deleteOne(
      { email: email, code: req.session.code },
      function (err, obj) {
        if (err) throw err;
      }
    );
    res.redirect("/groups");
  };