const mongoose  =require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignUpPage")
.then(()=>{
    console.log("Mongo se connect ho gaya 3000 port par");
})
.catch(()=>{
    console.log("Nhi ho paya mongo se connect");
})
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = new mongoose.model("Collection1",LoginSchema)
module.exports = collection