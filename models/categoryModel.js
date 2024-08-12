const mongoose = require("mongoose")

const CategorySchema = mongoose.Schema({

    categoryName : {
        type : String,
        required : [true, "Please Selcet A Valid Category Before Ites Upload"]
    },
    categoryImage : [
        {
            originalname: String,
            cloudinaryId: String,
            url: String,
        },
    ],
    subCategory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "subcategory",
            require : true
        }
    ],
    date :{
        type : Date,
        default : Date.now
    }

}) 

module.exports = mongoose.model("category", CategorySchema)