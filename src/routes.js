require("dotenv").config();
const express = require('express');
const Soup = require('./models/Soup');
const User = require('./models/User');
const passport = require("passport");
const SoupController = require("./controllers/SoupController");
const routes = express.Router();

routes.get("/", async (req, res) =>{
    const soups = await SoupController.getSoupsByQuery({stars : {$gte : 4.4}},4);
    const authStatus = req.isAuthenticated();
    if(soups){
        res.render("home",{
            soups,
            isAuthenticated : authStatus,
        });
    }
});
  
routes.get("/soups",async(req,res)=>{
    const soups = await SoupController.getAllSoups();
    const authStatus = req.isAuthenticated();
    if(soups){
        res.render("soups",{
            soups,
            isAuthenticated : authStatus,
        });
    }
});

/* .: SIGN IN :.*/
routes.get("/signin", (req, res)=> {
    res.render("login", { id: "",isAuthenticated : false})
})

routes.post("/signin", (req, res)=> {
    if(!req.body.username){ 
        res.json({success: false, message: "Username was not given"}) 
      } else { 
        if(!req.body.password){ 
          res.json({success: false, message: "Password was not given"}) 
        }else{ 
          passport.authenticate('local', function (err, user, info) {  
             if(err){ 
               res.json({success: false, message: err}) 
             } else{ 
              if (! user) { 
                res.json({success: false, message: 'username or password incorrect'}) 
              } else{ 
                req.login(user, function(err){ 
                  if(err){ 
                    res.json({success: false, message: err}) 
                  }else{ 
                    res.redirect("/");
                  } 
                }) 
              } 
             } 
          })(req, res); 
        } 
      } 
})

/* .: RESGISTER :. */
routes.get("/register", (req, res)=> {
    res.render("register",{isAuthenticated : false});
});

routes.post("/register", (req, res)=> {
    User.findOne({username : req.body.username},(err,foundUser)=>{
        if(!err){
        if(foundUser){
            //There is an user and he has to use another account
            //**TODO:** SEND AND ALERT TO THE USER
            res.redirect("/register");
        }else{
            User.register({username : req.body.username, name : req.body.firstName,lastName : req.body.lastName, address : req.body.address}, req.body.password , (err,user)=>{
            if(err){console.log(err); res.redirect("/register")}
            else{
                //A new user was saved
                console.log(user);
                passport.authenticate("local")(req,res,()=>{
                res.redirect("/")
                })
            }
            })
        }
        }else{console.log(err);}
    })
});

/* .: CART :. */
routes.get("/:id/cart", (req, res)=> {
    User.findOne({
        _id: req.params.id
    }, (e, foundUser)=> {
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


/* .: SOUPS :. */
routes.get("/soups/:id", async (req, res)=> {
    const soupID = req.params.id;
    const authStatus = req.isAuthenticated();
    const soupById = await SoupController.getSoupById(soupID);
    soupById ? 
        res.render("fooddetails", {  soup: soupById, isAuthenticated : authStatus }) : 
        res.send('Error while getting the soup')
});

routes.post("/soups/:id", async(req, res)=> {
    const soupId = req.params.id;
    const authStatus = req.isAuthenticated();
    if(authStatus){
            console.log("USER",req.user);
            console.log("ORDER", req.user.order);
            const isSoupInCart = req.user.order.includes(soupId);
            console.log(isSoupInCart);
            if(isSoupInCart){
                res.redirect('/cart');
            }
            else{
                User.updateOne({_id : req.user._id},{$push : {order : soupId}},(e)=>{
                    req.user.order = [...req.user.order,...soupId];
                    console.log(req.user.order);
                    if(!e){res.redirect("/cart")}
                    else{console.log(e);}
                  })
            }
    }else{
        res.render("login", {id:soupId, isAuthenticated : authStatus})
    }
})

routes.get("/signin/:id", (req, res)=> {
    const id = req.params.id;
    res.render("signin")
})
routes.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
})

routes.get("/cart",async(req,res)=>{
    if(req.user){
        const userId = req.user._id || false;
        const user = await User.findOne({_id : userId});
        await user.populate('order').execPopulate();
        res.render("cart",{soups : user.order , isAuthenticated : true})
    }else{
        res.render("login", { id: "",isAuthenticated : false})
    }
})

module.exports = routes;