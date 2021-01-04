const mongoose = require('mongoose');

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
    price: Number,
    description : String
});

module.exports = mongoose.model("Soup", soupSchema);