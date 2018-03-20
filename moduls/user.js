var mongoose = require('mongoose');
var Schenma = mongoose.Schema;

// create user Schema & model
var  userSchema  =new Schenma({
     userName:{
         type:String,
     },
     
    email:{
        type:String, unique:true, dropDups:true,
        required:[true,'email must be provide']
    },
    phoneNumber:{
        type:String,
      required:[true,'phoneNumber must be provide']
    },
    password:{
        type:String,
        required:[true,'password must be provide']
    },
    facebookKey:{
        type:String
    },
    deviceType:{
        type:String
    },
    imageUrl:{
        type : String
    },

});
var User =mongoose.model('User',userSchema);

module.exports = User; 
