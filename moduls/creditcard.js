var mongoose = require('mongoose');
var Schenma = mongoose.Schema;


// create creditcard Schema & model
var  creditcardSchema  =new Schenma({
    cardId:{
        type:String,
    },
    userId:{
        type:String,
        required:[true,'userId  must be Provided']
    },
    cardType:{
        type:String,
        required:[true,'cardType must be Provided'],
    },
    username:{
        type:String,
    },
    cardcvv:{
        type:String,
        required:[true,'cardCode must be Provided'],
      isPotentiallyValid: true,
       isValid: true
    },
    expirationDate:{
        type:Date,
        isPotentiallyValid: true, // if false, indicates there is no way this could be valid in the future 
        isValid: true,
    },
    cardNumber:{
        type:String,unique:true, dropDups:true,
        required:[true,'cardNumber be Provided'],
    }
});
var creditcard =mongoose.model('creditcard',creditcardSchema);

module.exports = creditcard;
