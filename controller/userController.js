const express = require("express")
const cashAsyncError =  require("../middleware/cashAsyncError")
const ErrorHandler = require("../utilities/errorHandler")
const User = require("../models/userModel")
const sendToken = require("../utilities/jwtToken")
const app = express();
const nodeMailer = require("nodemailer")
const  jwt  = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv")



dotenv.config({path:"./config/config.env"})

// Dummy user database (replace this with a real database)

function generateOTP() {
    // Logic to generate a random OTP (e.g., 6-digit number)
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


exports.RegesterUser = cashAsyncError(async(req, res, next) =>{
    const {name,email, password,role} = req.body;
    const Exituser = await User.findOne({email})
    if(Exituser){
        return next (new ErrorHandler("Email is Already Exit",400))
    }
    if(!name){
        return next (new ErrorHandler("Please Enter a Fill name ",400))
    }else if( !email  ) {
        return next (new ErrorHandler("Please Enter a Fill email",400))
    }else if (!password  ) {
        return next (new ErrorHandler("Please Enter a Fill password",400))

    }

    // Generate and store a random OTP
    const otp = generateOTP();
       // Send OTP to the user
    sendOTP(email, otp);
    // console.log(email)
    // Send response to the user      
        const user = new User({
            name,
            email,
            password,
            role,
            emailOTP: otp,
            isVerified: false
        })

        user.save()
        sendToken(user,201,res)
 })
async  function sendOTP(email, otp) {
//gmail send otp 
    const transporter = nodeMailer.createTransport({ 
         service: 'gmail',
         auth: {
           user: process.env.user_auth_user,
           pass: process.env.user_auth_pass
        }
    })

    const mailOptions = {
        from: process.env.email_my,
        to : email,
        subject: `DailyShop Account Verification Code`,
        text: `This is Your DailyShop Account virification Otp 
        ${otp}`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {   
        console.log(error)
    }
    
}

 // OTP verification endpoint
 exports.verify = cashAsyncError(async (req, res) => {
    const emailOTP = req.body.emailOTP;
    const email = req.body.email;
    // console.log(email)
    // console.log(emailOTP)

    try {
   const user = await User.findOne({email, emailOTP ,
    isVerified: false});

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    }
    // Update the isVerified field of user to true
    user.isVerified = true;
    await user.save();
        res.status(200).json({
            success: true,
            message: 'OTP verified'
        });
    }catch (error) { 
        
     console.log(error)   
    }
    
   // console.log(users.otp)
});


exports.loginUser = cashAsyncError(async(req, res, next) =>{ 

    const {email, password} = req.body;
        const user = await User.findOne({email, isVerified: true}).select("+password")
        console.log(user)

        if(!user){
            return next (new ErrorHandler("Email is Not Exit",400))
        }
    
        //compare password
       const isPasswordMatched = await user.comparePassword(password)

    
        if(!isPasswordMatched){
            return next (new ErrorHandler("Password is Not Exit",400))
        }
    
        sendToken(user,200,res)

 })
