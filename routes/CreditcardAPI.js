var express = require('express');
var routes = express.Router();
var validator = require('validator');
var valid = require('card-validator');
var Creditcard = require('../moduls/creditcard');

// get a list of creditcard
routes.get('/api',function(req,res,next){
    //res.send({type:"GET"});
  
    console.log(is_valid); // should respond true. 
    Creditcard.find({}).then(function (Creditcard) {
        res.send(Creditcard)
    }).catch(next);
});

// add a new Creditcard
routes.post('/api',function(req,res,next){
    var cardType = req.body.cardType;
    var cardcvv = req.body.cardcvv;
    var expirationDate = req.body.expirationDate;
    var cardNumber = req.body.cardNumber;
    var cvv = valid.cvv(cardcvv);
     console.log(cvv);
    var validcardNum = valid.number(cardNumber);
   console.log(validcardNum);
   
    if (!cvv.isValid)
    {
        var response = {"status":0,"message":"Invalid CVV","data":{}};
        res.json(response);
    }
    else if (!validcardNum.isValid){
        var response = {"status":0,"message":"Invalid card Number","data":{}};
        res.json(response);
    }
    else{
    Creditcard.create(req.body).then(function(Creditcard)
    {
        var response = {"status":1,"message":"Creditcard Details Added","data":{Creditcard}};
        res.json(response);

    }).catch(next);}
});

// delete a Creditcard
routes.delete('/api/:id',function(req,res,next){
    // res.send({type:"DELETE"});
    Creditcard.findByIdAndRemove({_id:req.params.id}).then(function (Creditcard) {
        res.send(Creditcard);
    }).catch(next);

});
routes.put('/api/:id',function(req,res,next){
    // res.send({type:"UPDATE"});
    Creditcard.findByIdAndUpdate({_id:req.params.id},req.body).then(function () {
        Creditcard.findOne({_id:req.params.id}).then(function (Creditcard) {
            res.send(Creditcard)
        })
    }).catch(next)
});
module.exports= routes;