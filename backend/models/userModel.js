const mongoose = require("mongoose");
const schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;


const userModelSchema = new mongoose.Schema({
    name : {
        type:String
    },
    password : {
        type :String
    },
    gender : {
        type : String
    },
    city : {
        type : String
    },
    phonenumber :{
       type : Number
    },
    role :{
        type : String,
        default:'User'
    },
    status :{
        type : String,
        default:'Active'
    }
});

module.exports = mongoose.model("userModel",userModelSchema);