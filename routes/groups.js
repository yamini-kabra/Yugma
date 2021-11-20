const express = require('express');
const { check, body } = require("express-validator");
const groupController = require('../controllers/groups');
const forAuth = require('../middleware/for-auth');

const router = express.Router();

//to
router.get('/groups', forAuth, groupController.groupsLandingPage);

router.get("/createGroup", groupController.getCreateGroup);

router.get("/joinGroup", [body("code", "Please Enter a code").isLength({ min: 1 })], groupController.getJoinGroup );

router.post("/createGroup", groupController.postCreateGroup);

router.post("/joinGroup", groupController.postJoinGroup);


router.get('/groups/group', forAuth, groupController.getGroup);

router.get('/groups/group/leave', forAuth, groupController.leaveGroup);
module.exports = router;
// <% if(clickOn === 'home'){ %>
//     <h2>welcome to your own space</h2>
//     <div class="channel" id="blur">
//           <ol class="rooms">
//               <% if(groups.length > 0){ %>
//                   <% for(let group of groups){ %>
//                       <li data-channel= <%=group.code %>>
//                                   <center>
//                                   <h4>
//                                       <%=group.name %>
//                                   </h4>
//                                   </center>
//                               </div>
//                           </div>
//                       </li>
//                   <% } %>
//               <% } %>
//           </ol>
//       </div>
//   </div>
