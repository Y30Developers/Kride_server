var mongoose = require('mongoose');
var Schenma = mongoose.Schema;


// create car Schema & model
var  carSchema  =new Schenma({
    carId:{
        type:String,
    },
    carModel:{
        type:String,
        required:[true,'carModel must be provide']
    },
    carNumber:{
        type:String,
        required:[true,'carNumber must be provide']
    },
    carName:{
        type:String,
        required:[true,'carName must be provide']
    },
    carCompany:{
        type:String,
        required:[true,'carCompany must be provide']
    },
    carColor:{
        type:String,
        required:[true,'carColor must be provide']
    },
    engineCapacity:{
        type:Number,
        required:[true,'engineCapacity must be provide']
    },
    seats:{
        type:Number,
        required:[true,'seats must be provide']
    },
    category:{
        type:String,
        required:[true,'category must be provide']
    },
    carPicture:{
        type:String
    },
    carProviderName:{
        type:String,
        required:[true,'carProviderName must be provide']
    },
    imageUrl:{
        type : String
    },

});
var car =mongoose.model('car',carSchema);

module.exports = car;
