const app = require("./app")
const ConnectDataBase = require("./config/database")
const dotenv = require("dotenv")
const cloudinary = require('cloudinary').v2;

//dotenv config path require
dotenv.config({path:"./config/config.env"})


//connect dataBase MongoDb
ConnectDataBase();

// Handling Uncaught Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})


// // upload image
cloudinary.config({
    cloud_name: 'daxvmjaff',
    api_key: '349718663461614',
    api_secret: 'L2T3hMpJNGFmPK8UysYBNrELsSM',
  });
  // Define a route
app.get('/', (req, res) => {
    res.send(`Hello, world! ${process.env.PORT}`);
  });
//server running 
 const server =  app.listen(process.env.PORT, (req, res) =>{
    console.log(`server is running on  http://192.168.1.103:${process.env.PORT} `)
})


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) =>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandledRejection")

    server.close(() =>{
        process.exit(1)
    })
})
