const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/404');
const config = require('./config');
const user = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: config.mongodbKey,
  collection: 'sessions'
});
const csrfProtection = csrf();


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
  app.use(csrfProtection);
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
    res.locals.csrfToken = req.csrfToken();
    next();
  });



const groupRoutes = require('./routes/groups');
const authRoutes = require('./routes/auth');

app.use(groupRoutes);
app.use(authRoutes);
app.use(errorController.get404page);

mongoose.connect(config.mongodbKey).then(result => {
    console.log("db connected");
    app.listen(config.port);
}).catch(err => {
    console.log(err);
});

