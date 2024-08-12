const cookie = require('cookie-parser')

const sendToken = (user, statuscode, res) =>{
    const token = user.getJWTToken()

    // expressout date
    const options = {
        exprires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: false
    }

    res.status(statuscode).cookie("token", token, options).json({
        success:true,
        user,
        token
    })

}

module.exports = sendToken