var mongoose = require('mongoose');
var Schenma = mongoose.Schema;


// create rides Schema & model
var  ridesSchema  =new Schenma({
    rideid:{
        type:String
    
    },
    userid:{
        type:String ,
        required:[true,'userid must be provide']
    },
    place:{
        type:String
    },
    servicetype:{
        type:String
    },
    userPhoneNumber:{
        type:String
    },

    location: {
      //  type: ["Point"],
      //  coordinates: [ Number, Number ],  // [<longitude>, <latitude>]
     //   index: '2d'      // create the geospatial index
        },
    driverid:{
        type:String
    }, 
    pickupLongitude:{
        type: Number ,
        required:[true,'pickupLongitude must be provide']
    },
    pickupLatitude:{
        type:Number,
        required:[true,'pickupLatitude must be provide']

    },
    dropoffLatitude:{
        type:Number
    },
    isActive:{
        type:Boolean
    }
    ,
    dropoffLongitude:{
        type:Number
    },
    pickupTime : {
        type : String
    },
    dropofftime :{
        type : String
    },
    frate:{
        type:Number
    },
    bill:{
        type:String
    },
    paymentMethod:{
        type:String,
        required:[true,'paymentMethod must be provide']
    },
    userRating:{
        type:Number
    },
    captainRating:{
        type:Number
    },
    status: {
        type:Number
    },
    bookTime:{
        type :String
    },
    RecieveAmount:{
        type: String
    }
    

});
var rides =mongoose.model('rides',ridesSchema);

module.exports = rides;
