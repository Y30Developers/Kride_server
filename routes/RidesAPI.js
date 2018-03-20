var express = require('express');
var routes = express.Router();
var Rides = require('../moduls/rides');
var RideLater = require('../moduls/ridelater');
var miscellaneous = require('../moduls/miscellaneous');


// get a list of rides
routes.get('/api',function(req,res,next){
    //res.send({type:"GET"});
    Rides.find({}).then(function (Rides) {
        res.send(Rides)
    }).catch(next);
});

// get miscellaneous Data
routes.get('/miscellaneous',function(req,res,next){
    miscellaneous.find({},{_id:0}).then(function (miscellaneous) {
        res.send(miscellaneous)
    }).catch(next);
});
// Get A list of All Book Rides
routes.get('/BookRide',function(req,res,next){
    RideLater.find({}).then(function (RideLater) {
        res.send(RideLater)
    }).catch(next);
});
// add a new rides
routes.post('/api',function(req,res,next){
    var pickupLongitude = req.body.pickupLongitude;
    var bookTime = new Date().toLocaleTimeString();
    var pickupLatitude = req.body.pickupLatitude;
    req.body.status=0;
    req.body.isActive=true;
    req.body.bookTime= bookTime;
    var location=  { type: "Point", coordinates: [ pickupLongitude, pickupLatitude] };
    req.body.location=location;
    console.log(req.body,req.body.isActive,req.body.status);
     Rides.create(req.body).then(function(Rides)
 {         console.log(req.body);
        var ride_id=Rides._id;
        var ride_status = Rides.status;
        var response = {"status":1,"message":"Success","data":{"Rideid":ride_id}};
        res.send(response);

    }).catch(next);
});
 

// Ride Later
routes.post('/RideLater',function(req,res,next){
    var pickupLongitude = req.body.pickupLongitude;
    var bookTime = new Date().toLocaleTimeString();
    var pickupLatitude = req.body.pickupLatitude;
    req.body.status=0;
    req.body.isActive=true;
    req.body.bookTime= bookTime;
    var location=  { type: "Point", coordinates: [ pickupLongitude, pickupLatitude] };
    req.body.location=location;
    console.log(req.body,req.body.isActive,req.body.status);
    RideLater.create(req.body).then(function(RideLater)
 {         console.log(req.body);
        var ride_id=RideLater._id;
        var ride_status = RideLater.status;
        var response = {"status":1,"message":"Success","data":{"Rideid":ride_id}};
        res.send(response);

    }).catch(next);
});


// get all Accpted Rides.

routes.get('/acceptride',function(req,res,next){
    //res.send({type:"GET"});
    Rides.find({status:1}).then(function (Rides) {
        res.send(Rides);
    }).catch(next);
});


// User get all BookRides 
routes.post('/BookRide',function(req,res,next){
    var userid = req.body.userid
  RideLater.find({userid:userid}).then(function (RideLater) {
    var response = {"status":1,"message":"All Book Rides","data":{RideLater}};
    res.json(response);
    }).catch(next);
});


// delete a rides
routes.delete('/api/:id',function(req,res,next){
    // res.send({type:"DELETE"});
    Rides.findByIdAndRemove({_id:req.params.id}).then(function (Rides) {
        res.send(Rides);
    }).catch(next);

});
routes.put('/api/:id',function(req,res,next){
    // res.send({type:"UPDATE"});
    Rides.findByIdAndUpdate({_id:req.params.id},req.body).then(function () {
        Rides.findOne({_id:req.params.id}).then(function (Rides) {
            res.send(Rides)
        })
    }).catch(next)
});
module.exports= routes;