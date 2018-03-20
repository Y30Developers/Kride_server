var mongoose = require('mongoose');
var Schenma = mongoose.Schema;


// create creditcard Schema & model
var  miscellaneousSchenma =new Schenma({
    PerKm:{
        type:String,
    },
    Permint:{
        type:String,
    },
    Base:{
        type:String
    }
});
var miscellaneous =mongoose.model('miscellaneous',miscellaneousSchenma);

module.exports = miscellaneous;
