const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/404');
const config = require('./config');
const user = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: config.mongodbKey,
  collection: 'sessions'
});
// const csrfProtection = csrf();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

});



app.set('view engine' , 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
  // app.use(csrfProtection);
  app.use(flash());




app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    user.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
  
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();
  });



const groupRoutes = require('./routes/groups');
const insideGroupRoutes = require('./routes/insideGroup');
const authRoutes = require('./routes/auth');
const { appendFile } = require('fs');


app.use(groupRoutes);
app.use(authRoutes);

//chat portion


const chat = require("./models/chat");

app.get("/groups/group/chats", (req, res, next) => {
  console.log("in receive chat functio");
chat.find({ groupCode: req.session.code })
  .then((chats) => {
    res.send(chats);
  })
  .catch((err) => console.log(err));
});

app.post("/groups/group/chats", async (req, res, next) => {
  console.log("in post chat functio");
try {
  const name = req.session.user.username;
  const msg = req.body.message;
  const groupCode = req.session.code;
  var newChat = new chat({
    name: name,
    message: msg,
    groupCode: groupCode,
  });

  newChat.save()
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  // var savedMessage = await message.save();
   
    io.emit("message", newChat);
  // }
  res.sendStatus(200);
}
 catch (error) {
  res.sendStatus(500);
  return console.error(error);
} 
finally {
  console.log("message post called");
}
});

/////////////

// app.use('/groups', insideGroupRoutes);
app.use(errorController.get404page);

mongoose.connect(config.mongodbKey).then(result => {
    console.log("db connected");
    server.listen(config.port);
}).catch(err => {
    console.log(err);
});

