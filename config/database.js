const mongoose = require("mongoose")

const ConnectDataBase = () =>{
    mongoose.set("strictQuery", false);
    mongoose
    .connect("mongodb+srv://azharul:0HHpaElwgzZHF8k5@azharul.3dooh1i.mongodb.net/DailyBazer")
    .then(()=>{
        console.log("connected DataBase")
    })
    .catch((err)=>{console.log(err.message)})
}
module.exports = ConnectDataBase

