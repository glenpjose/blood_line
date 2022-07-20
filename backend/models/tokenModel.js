const mongoose = require("mongoose");
const schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const tokenModelSchema = new mongoose.Schema({
    tokenId:{
        type:mongoose.Schema.Types.ObjectId,ref:"userModel"
    },
    token:{
        type:String
    },
    role:{
        type:String
    }

})
module.exports = mongoose.model("tokenModel",tokenModelSchema);