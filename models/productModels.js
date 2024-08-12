// all Internal Package
const mongoose =  require("mongoose")

const productSchema = mongoose.Schema({

    productname : {
        type :String,
        required : [true, "Please Write a Product Name"],
        trim : true
    },
    description :{
        type: String,
        required : [true, "Please Write a Product Description"],
        trim : true
    },
    size : {
        type:String,
        default :'no'
    },
    color: {
        type : String,
        default :'no'
    },
    location : {
        type : String,
        default : 'Bangladesh',
        trim : true
    },
    regularprice : {
        type : Number,
        required : [true, "Please Write a Valid Regular Price"]
    },
    currentprice : {
        type : Number,
        required : [true, "Plese Write a Valid Current Price"]
    },
    ratings : {
        type : Number,
        default : 0
    }, 

    category : {
        type : String,
        required : [true, "Please Write a Valid Category"]
    }, 

    subcategory : {
        type : String,
        required : [true, "Please Write a valid SubCategory"]
    }, 
    frashsale : {
        type : String,
        dafault : "no"
    },
    dailayshoprecomanded : {
        type : String,
        default : "recomanded"
    },
    productcompany : {
        type : String,
        default : "no"
    },
    freedalivary :  {
        type : String,
        default : "no"
    },
    warranty : {
        type : String,
        default : "no"
    },
    brand : {
        type : String,
        default : "no"
    },
    cashondalivary : {
        type : String,
        default : "no"
    },
    freeshipping :  {
        type : String,
        default : "no"
    },
    offer : {
        type : String,
        default: "no"
    },
    spicialcategoryto : {
        type: String,
        default : "no"
    },
    numberofreviews : {
        type : Number,
        default : 0
    },
    productStock : {
        type : Number,
        required : [true, "Please Inter a Valid Product Stoke"]
    },
    productimage : [
        {
            originalname: String,
            cloudinaryId: String,
            url: String,
        },
    ]
    ,

    spicialcategorytop : {
       type : String,
       default: "yes"
    },
   

    date : {
        type : Date,
        default : Date.now
    },
    lastupdate : {
        type : Date,
        default : Date.now
    },
    
    flashsale : {
        type: Object,
        default: { value: 'yes', endDate: 47 },
    },
    flashsaleprice : {
        type : Object,
        default : 'yes',
       
    },
    flashsaleenddate : { 
        type : Date,
        default : 31
    
    }
    


})

// Function to get a random product ID (you may need to adjust this based on your actual data)
function getRandomProductId() {
    // This is a placeholder; replace it with logic to get a random product ID from your database
    const allProductIds = ["1", "2", "3", /* Add all product IDs here */];
    const randomIndex = Math.floor(Math.random() * allProductIds.length);
    return allProductIds[randomIndex];
}


module.exports = mongoose.model("dailyShopProducts", productSchema)

