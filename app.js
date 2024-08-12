// require model option 
const express = require("express")
const dotenv = require("dotenv").config()
const path = require("path")
const cookieParser  = require("cookie-parser")
const bodyParser = require("body-parser")
const errorHandler = require('./middleware/error')
const user = require("./route/userRoute")
const product = require("./route/productRoute")
const category = require("./route/categoryRoute")
const message = require("./route/ChatRoute")
const PaymentGetway = require("./route/PaymentRoute")
const cors = require('cors')
//exChange Express to app
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


app.use(cors({
  origin: 'https://dailyshop-azharul.vercel.app', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));


app.get('/', (req, res) => {
  res.send('running server');
});

//server any error handler message devolper
app.use(errorHandler)


//app all router handleer 
app.use("/api/v1", user)
app.use("/api/v1", product)
app.use("/api/v1", category)
app.use("/api/v1", message)
app.use("/api/v1", PaymentGetway)

//path direct for frontend
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
//   });
    



module.exports = app
