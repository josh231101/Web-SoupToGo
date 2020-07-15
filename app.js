require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@cluster0.usnm4.mongodb.net/soups?retryWrites=true&w=majority", {
  useNewUrlParser: true
})
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
  email: String,
  password: String,
  order: [soupSchema]
})
const User = new mongoose.model("User", userSchema);
const newuser = new User({
  name: "Josue",
  lastName: "Arreola",
  address: "Palma Real 243",
  email: "wiijosue333@gmail.com",
  password: "12345"
})
// newuser.save();

/*SOUP MODEL EXAMPLE
const newSoup = new Soup({
  imgUrl : "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/images/2016/08/caldoderes.jpg",
  title : "Caldo de pollo",
  stars : 4.5,
  price : 70
})
newSoup.save();*/


/*Soup.find(function(e,foundSoups){
  User.updateOne({email : "wiijosue333@gmail.com"},{$push : { order : foundSoups } },function(err,foundSoup){
    if(!e){
      console.log(foundSoup);
    }else{
      console.log(e);
    }
  })
})*/

app.get("/", function(req, res) {
  Soup.find({
    stars: {
      $gte: 4.4
    }
  }, function(err, foundsoups) {
    if (!err) {
      var selectedSoups = foundsoups.slice(0, 4);
      res.render("home", {
        soups: selectedSoups
      })
    } else {
      console.log(err);
    }
  })
})
app.get("/signin", function(req, res) {
  res.render("login", {
    id: ""
  })
})
app.post("/signin", function(req, res) {
  const useremail = req.body.email;
  const userpassword = req.body.password;
  const soupId = req.body.id;
  console.log(soupId);

  User.findOne({
    email: useremail
  }, function(e, foundUser) {
    if (!e) {
      if (foundUser) {
        if (foundUser.password === userpassword) {
          if (soupId != null) {
            /**/
            /*MUST DELETE*/
            Soup.findOne({
              _id: soupId
            }, function(e, foundSoup) {
              if (foundSoup) {
                console.log(foundUser.order);
                console.log(foundUser.order.id);
                //BEFORE UPDATING CHECK IF THE SOUP IS NOT IN THE CART!
                let soupInTheCart = false
                foundUser.order.forEach(function(soup, iterator) {
                  if (foundSoup.title === soup.title  ) {
                    //The soup the user wants is in his cart
                    soupInTheCart = true;
                  }
                })
                console.log(foundUser.order.length);

                console.log(soupInTheCart)
                if (soupInTheCart != true) {
                  //Soup added to cart is not in the user cart

                  User.updateOne({
                    _id: foundUser._id
                  }, {
                    $push: {
                      order: foundSoup
                    }
                  }, function(e) {
                    if (!e) {
                      console.log(foundUser.order);
                      console.log(foundUser.order.id);
                      res.redirect("/" + foundUser._id + "/cart")
                    } else {
                      console.log(err);
                    }
                  })
                } else {
                  //Soup Added to cart is actually in there
                  res.redirect("/" + foundUser._id + "/cart")
                }
              } else {
                console.log(e);
              }
            })
          } else {
            res.redirect("/" + foundUser._id + "/cart")
          }
        } else {
          console.log("Contraseña incorrecta");
        }
      } else {
        res.redirect("/register")
      }
    } else {

    }
  })
})

app.get("/register", function(req, res) {
  res.render("register");
})
app.post("/register", function(req, res) {
  const newUser = new User({
    name: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    email: req.body.email,
    password: req.body.password
  })
  newUser.save(function(e, createdUser) {
    if (!e) {
      res.redirect("/" + createdUser._id + "/cart")
    } else {
      console.log(e);
    }
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

app.listen(8080, function() {
  console.log("Page running on port 8080");
})
