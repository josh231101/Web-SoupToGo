const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://admin-josue:Test123@cluster0.usnm4.mongodb.net/soups?retryWrites=true&w=majority", {useNewUrlParser : true})
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
  price : String
})

const Soup = new mongoose.model("Soup",soupSchema);

const newSoup = new Soup({
  imgUrl : "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/images/2016/08/caldoderes.jpg",
  title : "Caldo de pollo",
  stars : 4.5
})

app.get("/",function(req,res){
  Soup.find(function(err,foundsoups){
    if(!err){
      res.render("home",{
        soups : foundsoups
      })
    }
    else{console.log(err);}
  })
})

app.listen(8080,function(){
  console.log("Page running on port 8080");
})
