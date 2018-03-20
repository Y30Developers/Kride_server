var mongoose = require('mongoose');
var Schenma = mongoose.Schema;


// create rides Schema & model
var  ridelaterSchema  =new Schenma({
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
    }
    

});
var rideslater =mongoose.model('ridelater',ridelaterSchema);

module.exports = rideslater;
