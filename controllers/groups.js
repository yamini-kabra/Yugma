const userGroups = require('../models/userGroups');
const user = require('../models/user');
const events = require("../models/events");
const groups = require('../models/groups');
const todo = require('../models/todo');

exports.groupsLandingPage = (req,res,next) =>{
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    userGroups.find({ email: req.session.user.email }).then(async (groups) => {
      // console.log(groups);
      var eventlist =[];
      for(var i = 0 ; i < groups.length ; i++)
      {
        var result = await events.find({ code: groups[i].code });
        eventlist.push(result);
        // console.log("result");  
      }
      var flatArray = Array.prototype.concat.apply([], eventlist); //flatten array of arrays
      // console.log(flatArray);
      todo.find({ email: req.session.user.email }).then((tasks) =>{
        return res.render("groups", {
          clickOn : 'home',
        groups: groups,
        username: req.session.user.username,
        errorMessage: message,
          eventlist: flatArray,
          tasklist: tasks
      });
      }); 
      // console.log(eventlist);
  
  });

    // userGroups.find({ email: req.session.user.email })
    //   .then((groups) => {
    //     console.log(req.session.user.username);
       
    //     events.find().then((myevents)=>{
    //       todo.find({ email: req.session.user.email }).then((tasks) =>{
    //         return res.render("groups", {
    //           clickOn : 'home',
    //         groups: groups,
    //         username: req.session.user.username,
    //         errorMessage: message,
    //           eventlist: myevents,
    //           tasklist: tasks
    //       });
    //       }); 
    //     });
        
    //   });
    
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
        console.log("In create group, current session username is " + req.session.user.username);
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
        console.log("In join group, current session username is " + req.session.user.username);
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
          console.log("group is created");
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
      // alert("Code already exists");
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
      
    // });
    console.log("groupNmae" + req.session.groupName);
   
    let eventlist = [];
    events.find({ code: req.session.code }).then((myevents) => {
      eventlist = myevents;
      groups.findOne({ code: req.session.code }).then((group) => {
        req.session.groupName = group.name;
  
        userGroups.find({name: group.name}).then(async (emailList)=>{
            var userlist =[];
            console.log("emaillist");
            console.log(emailList);
            for(var i = 0 ; i < emailList.length ; i++)
            {
              console.log("email" + i + "    " + emailList[i].email);
              var result = await user.findOne({email:emailList[i].email});
              console.log("result" + i + "    " + result.username);
              userlist.push(result.username);
              // user.findOne({email:emailList[i].email}, function(err,result) {
              //   console.log("user" + i + "    " + result.username);
              //   userlist.push(result.username);
              // });  
            }           
            console.log("userlist" + userlist);
              return res.render("insideGroup", {
                username: req.session.user.username,
                groupName: req.session.groupName,
                eventlist: eventlist,
                userlist: userlist,
              });
        });
        
      });
    });
    console.log(eventlist);
    
  
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
  exports.posttodo = (req, res, next) => {
    const ToDo = new todo({
      email: req.session.user.email,
      task: req.body.task,
      checked: "0",
    });
    ToDo.save()
      .then((result) => {
        console.log("todo inserted");
      })
      .catch((err) => {
        console.log(err);
        console.log("err generated");
      });
    return res.redirect("/groups");
  };
  exports.taskremove = (req, res, next) => {
    const id = req.params.id;
    todo.findByIdAndRemove(id, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/groups");
    });
  };

  exports.taskchecked = (req,res,next)=>{
    const id = req.params.id;
    console.log("task id" + id);
    todo.updateOne({"_id":id}, { checked:"1"})
    .then((ToDo)=>{
      console.log(ToDo);
        console.log("checked")
        res.redirect('/groups')
    })
    .catch((err)=>console.log(err));
};
exports.taskunchecked = (req,res,next)=>{
  const id = req.params.id;
  todo.updateOne({"_id":id}, { checked:"0"})
  .then(()=>{
      console.log("unchecked")
      res.redirect('/groups')
  })
  .catch((err)=>console.log(err));
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