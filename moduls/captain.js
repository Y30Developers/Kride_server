var mongoose = require('mongoose');
var Schenma = mongoose.Schema;

// create captain Schema & model
var  captainSchema  =new Schenma({
    captainName:{
        type:String,
        required:[true,'captainName must be provide']
        
    },
    driverid:{
            type: mongoose.Schema.Types.ObjectId,
            index: true
        
    },
     phoneNumber:{
        type:String, unique:true, dropDups:true,required:[true,'phoneNumber must be provide']
    },
    password:{
        type:String,
        required:[true,'password must be provide']
        
    },
    deviceType:{
        type:String
    },
    imageUrl:{
        type : String
    },
    

});

var captain =mongoose.model('captain',captainSchema);

module.exports = captain;
