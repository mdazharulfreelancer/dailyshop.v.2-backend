const mongoose = require('mongoose')

const subcategorySchema = mongoose.Schema({
    subCategoryName : {
        type : String,
        required : [true, "Please Enter Selcet A Valid SubCategory"]
    },
    subcategoryImage : [
        {
            originalname: String,
            cloudinaryId: String,
            url: String,
        },
    ],
     date : {
        type : Date,
        default : Date.now
     }
})

module.exports = mongoose.model("subcategory", subcategorySchema)