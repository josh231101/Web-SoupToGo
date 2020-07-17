require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
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

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@cluster0.usnm4.mongodb.net/soups?retryWrites=true&w=majority", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex",true);

const soupSchema = mongoose.Schema({
  imgUrl: {
    type: String,
    required: [1, "https://uss.com.ar/corporativo/wp-content/themes/consultix/images/no-image-found-360x260.png"]
  },
  title: String,
  stars: {
    type: Number,
    min: 0,
    max: 5
  },
  price: Number
})
const Soup = new mongoose.model("Soup", soupSchema);

const userSchema = mongoose.Schema({
  name: String,
  lastName: String,
  address: String,
  username: String,
  password: String,
  order: [soupSchema]
})
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", function(req, res) {
  Soup.find({
    stars: {
      $gte: 4.4
    }
  }, function(err, foundsoups) {
    if (!err) {
      var selectedSoups = foundsoups.slice(0, 4);
      //Check if the user is authenticated
      if(req.isAuthenticated()){
        res.render("home", {
          soups: selectedSoups,
          isAuthenticated : true
        })
      }else{
        res.render("home", {
          soups: selectedSoups,
          isAuthenticated : false
        })

      }
    } else {
      console.log(err);
    }
  })
})


app.get("/signin", function(req, res) {
  res.render("login", { id: "",isAuthenticated : false})
})

app.post("/signin", function(req, res) {
  const soupId = req.body.id;
  console.log(soupId);
  // const user = new User({
  //   username : req.body.username,
  //   password : req.body.password
  // })
  User.findOne({username : req.body.username},function(e,user){
    req.login(user,function(err){
      if(err){
        console.log(err);
        res.redirect("/register");
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/");
        })
      }
    })

  })

  // User.findOne({
  //   username : useremail
  // }, function(e, foundUser) {
  //   if (!e) {
  //     if (foundUser) {
  //       if (foundUser.password === userpassword) {
  //         if (soupId != null) {
  //           /**/
  //           /*MUST DELETE*/
  //           Soup.findOne({
  //             _id: soupId
  //           }, function(e, foundSoup) {
  //             if (foundSoup) {
  //               console.log(foundUser.order);
  //               console.log(foundUser.order.id);
  //               //BEFORE UPDATING CHECK IF THE SOUP IS NOT IN THE CART!
  //               let soupInTheCart = false
  //               foundUser.order.forEach(function(soup, iterator) {
  //                 if (foundSoup.title === soup.title  ) {
  //                   //The soup the user wants is in his cart
  //                   soupInTheCart = true;
  //                 }
  //               })
  //               console.log(foundUser.order.length);
  //
  //               console.log(soupInTheCart)
  //               if (soupInTheCart != true) {
  //                 //Soup added to cart is not in the user cart
  //
  //                 User.updateOne({
  //                   _id: foundUser._id
  //                 }, {
  //                   $push: {
  //                     order: foundSoup
  //                   }
  //                 }, function(e) {
  //                   if (!e) {
  //                     console.log(foundUser.order);
  //                     console.log(foundUser.order.id);
  //                     res.redirect("/" + foundUser._id + "/cart")
  //                   } else {
  //                     console.log(err);
  //                   }
  //                 })
  //               } else {
  //                 //Soup Added to cart is actually in there
  //                 res.redirect("/" + foundUser._id + "/cart")
  //               }
  //             } else {
  //               console.log(e);
  //             }
  //           })
  //         } else {
  //           res.redirect("/" + foundUser._id + "/cart")
  //         }
  //       } else {
  //         console.log("Contraseña incorrecta");
  //       }
  //     } else {
  //       res.redirect("/register")
  //     }
  //   } else {
  //
  //   }
  // })
})

app.get("/register", function(req, res) {
  res.render("register",{isAuthenticated : false});
})
app.post("/register", function(req, res) {

  User.findOne({username : req.body.username},function(err,foundUser){
    console.log(foundUser + " 1 ")
    if(!err){
      if(foundUser){
        //There is an user and he has to use another account
        //**TODO:** SEND AND ALERT TO THE USER
        res.redirect("/register");
      }else{
        User.register({username : req.body.username, name : req.body.firstName,lastName : req.body.lastName, address : req.body.address}, req.body.password , function(err,user){
          if(err){console.log(err); res.redirect("/register")}
          else{
            //A new user was saved
            console.log(user);
            passport.authenticate("local")(req,res,function(){
              res.redirect("/")
            })
          }
        })
      }
    }else{console.log(err);}
  })
})
app.get("/:id/cart", function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(e, foundUser) {
    if (!e) {
      if (foundUser) {
        res.render("cart", {
          soups: foundUser.order
        });
      } else {

      }
    }
  })

});

app.get("/soups/:id", function(req, res) {
  const soupID = req.params.id;
  Soup.findOne({
    _id: soupID
  }, function(e, foundSoup) {
    res.render("fooddetails", {
      soup: foundSoup
    });
  })
})
app.post("/soups/:id", function(req, res) {
  const id = req.params.id;
  res.render("login", {
    id: id
  })
})

app.get("/signin/:id", function(req, res) {
  const id = req.params.id;
  res.render("signin")
})
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})
app.get("/cart",function(req,res){
  res.render("cart",{soups : req.user.order ,isAuthenticated : true})
})
let port = process.env.PORT
if(port === null || port === ""){
  port = 8080
}
app.listen(8080, function() {
  console.log("Web App running succesfully");
})
