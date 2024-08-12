
const mongosse = require("mongoose")

const uloadSchema = mongosse.Schema({
    name: String,
    price: Number,
    image: [
      {
        originalname: String,
        cloudinaryId: String,
        url: String,
      },
    ],

})

module.exports = mongosse.model("uploadimagetest", uloadSchema)