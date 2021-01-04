require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require('./routes');
const passport = require("passport");
const session = require("express-session");
const User = require('./models/User');
const app = express();

//DB connection
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.usnm4.mongodb.net/soups?retryWrites=true&w=majority`, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});
mongoose.connection.on('error',()=>{
  throw new Error(`unable to connect to database: ${process.env.DB_USER}`);
});
mongoose.set("useCreateIndex",true);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Create a session
app.use(session({
  secret : "Our little secret.",
  resave : false,
  saveUninitialized : false
}))

//Tell our app to use passport and using the session
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(routes);
let port = process.env.PORT
if(port === null || port === ""){
  port = 3000
}
app.listen(3000, function() {
  console.log("Web App running succesfully");
})
