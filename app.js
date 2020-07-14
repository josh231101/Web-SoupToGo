require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD +"@cluster0.usnm4.mongodb.net/soups?retryWrites=true&w=majority", {useNewUrlParser : true})
const soupSchema = mongoose.Schema({
  imgUrl : {
    type : String,
    required : [1, "https://uss.com.ar/corporativo/wp-content/themes/consultix/images/no-image-found-360x260.png"]
  },
  title : String,
  stars : {
    type : Number,
    min : 0,
    max : 5
  },
  price : Number
})

const Soup = new mongoose.model("Soup",soupSchema);


/*SOUP MODEL EXAMPLE
const newSoup = new Soup({
  imgUrl : "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/images/2016/08/caldoderes.jpg",
  title : "Caldo de pollo",
  stars : 4.5,
  price : 70
})
newSoup.save();*/
app.get("/",function(req,res){
  Soup.find({stars : { $gte : 4.4 }},function(err,foundsoups){
    if(!err){
      var selectedSoups = foundsoups.slice(0,4);
      res.render("home",{
        soups : selectedSoups
      })
    }
    else{console.log(err);}
  })
})

app.listen(8080,function(){
  console.log("Page running on port 8080");
})
