const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        maxlength: [20, 'Username cannot be more than 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true,
        trim: true,
        maxlength: [50, 'Username cannot be more than 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
  
    date: {
        type: Date,
        default: Date.now
    },
    updatedate: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    cart: {
        type: Array,
        default: []
    },
    emailOTP:String,

    isVerified : Boolean,
})

UserSchema.pre("save" , async function (next){

    if(!this.isModified("password")){
      next();
    }

    this.password = await bcrypt.hash(this.password , 10)
})
// compere password

UserSchema.methods.comparePassword  = async function (password) {
    return await bcrypt.compare(password, this.password)
  }
  
// JWTToken

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id} , process.env.JWT_SECRET , {
      expiresIn : process.env.EXPIRESIN_DATE
    })
  }


module.exports = mongoose.model('UserTable', UserSchema)
