var express = require('express');
var routes = express.Router();
var validator = require('validator');
var Captain = require('../moduls/captain');
var Rides = require('../moduls/rides');
var User = require('../moduls/user');
var fs = require('fs');
var geocoder = require('geocoder');
var User = require('../moduls/user');
var geodist = require('geodist');
var mongoose = require('mongoose');

// get a list of captain
routes.get('/api',function(req,res,next){
    Captain.find({}).then(function (Captain) {
        res.send(Captain);
    }).catch(next);
});


// add a new Captain with validation 
routes.post('/api',function(req,res,next){
    var password = req.body.password;
    var Phone = req.body.phoneNumber;
    var passIsValid = validator.isLength(password,{min:4});
  // var phoneIsValid = validator.isMobilePhone(Phone);
     var phoneIsValid = validator.isLength(Phone,{min:11},{max:11});
if (phoneIsValid && passIsValid) {
     Captain.create(req.body).then(function(Captain)
     {    var response = {"status":1,"message":"Sucess","data":{Captain}};
        console.log(Captain);
         res.send(response);
     }).catch(next);
     
 } else if (!phoneIsValid) {
        var response = {"status":0,"message":"Invalid Number:","data":{}};
        res.json(response);
 } else if (!passIsValid) {
     var response = {"status":0,"message":"password invalid","data":{}};
   res.json(response);
 }
 
   
});
//get all rides 

routes.get('/allrides',function(req,res,next){
    var driverLatitude = req.body.driverLatitude;
    var driverLongitude = req.body.driverLongitude;
    console.log(driverLatitude);
    console.log(driverLongitude);
    Rides.find({}).then(function (Rides) {
        var response = {"status":1,"message":"All near by rides","data":{Rides}};
        res.send(response);
    }).catch(next);
});


// condtion ride with latitue and logitute
routes.post('/allnearrides',function(req,res,next){
    var driverLongitude = req.body.driverLongitude;
    var driverLatitude = req.body.driverLatitude;
    var accpetdriverid = req.body.driverid;    
    console.log("driverLongitude:"+driverLongitude);
    console.log("driverLatitude:"+driverLatitude);
    console.log("accpetdriverid:"+accpetdriverid);
    
    Rides.find(
        { $and: [ {
            location:
            { $near:
               {
                 $geometry: { type: "Point",  coordinates: [ driverLongitude, driverLatitude] },
             //    $maxDistance: 5000
               }
            }},{status:0} ] }
    ).limit(1).then(function (Ride) {
        
        if (Ride.length > 0) {
            var ride_id = Ride[0]._id;
            console.log("rideID :"+ride_id);
            req.body.status=1;
            Rides.findOneAndUpdate({_id:ride_id},
                {$set:{driverid:accpetdriverid,status:1}},{w:1}).then(function(Rides)
            {  console.log(Rides);
                var response = {"status":1,"message":"All near by rides","data":{"Rides":Ride}};
                res.send(response);
            });
        }
        else {
            var response = {"status":0,"message":"No Ride Available","data":{}};
            res.send(response);
        }

        
       
    }).catch(function(err){
        console.log(err);
        // res.send("erorrrrr");

    });
});

// pick a ride 
//change status of ride and add driverid 

routes.post('/getride',function(req,res,next){
    var rideid = req.body.rideid;
    var accpetdriverid = req.body.driverid;
    req.body.status=1;
    Rides.findOneAndUpdate({_id:req.body.rideid},
        {$set:{driverid:accpetdriverid,status:1}},{w:1}).then(function(Rides)
    {  
        var response = {"status":1,"message":"Ride accpetd","data":{Rides}};
        console.log(Rides);
        res.send(response);

    }).catch(next);

});


// When driver Arrived at User location 
routes.post('/captainArrived',function(req,res,next){
    var rideid = req.body.rideid;
  var status=  req.body.status=2; 
    Rides.update({_id:req.body.rideid},{$set:{status:status}},{w:1}).then(function(Rides)
    { 
        var response = {"status":1,"message":"Driver Arrived","data":{"status":status}};
        res.send(response);

    }).catch(next);

});

// when driver start the ride (RIDE START)

routes.post('/startRide',function(req,res,next){
    var rideid = req.body.rideid;
    var pickupTime = new Date().toLocaleString();
    req.body.pickupTime=pickupTime;
    console.log(pickupTime);
    var status=  req.body.status=3; 
    var pickupLatitude = parseFloat(req.body.pickupLatitude);
    var pickupLongitude =   req.body.pickupLongitude;
    console.log("Rideid :"+rideid+" pickupLatitude :"+ pickupLatitude +" pickupLongitude :"+ pickupLongitude);
    Rides.update(
        {_id:req.body.rideid},
        {
            $set:
            {status:status,
            pickupTime: pickupTime,
            pickupLatitude:pickupLatitude,
             pickupLongitude:pickupLongitude
        }}
        ,{w:1}).then(function(Rides)
    {   var response = {"status":1,"message":"Ride Start","data":{"status":status}};
    console.log("Ride Start");   
        res.send(response);

    }).catch(next);
   

});

// when driver Stop the ride (RIDE STOP)
routes.post('/stopRide',function(req,res,next){
    var rideid = req.body.rideid;
    var status=  req.body.status=5; 
    var dropofftime = new Date().toLocaleString();
    req.body.dropofftime= dropofftime;
    var isRideValid= validator.isEmpty(rideid);
    var dropoffLatitude = req.body.dropoffLatitude;
    var dropoffLongitude = req.body.dropoffLongitude;
    console.log("Rideid :"+rideid+" dropoffLatitude :"+ dropoffLatitude +" dropoffLongitude :"+ dropoffLongitude);
    Rides.update({_id:req.body.rideid},{$set:{ status:status,dropofftime: dropofftime,dropoffLatitude:dropoffLatitude,dropoffLongitude:dropoffLongitude}},{w:1}).then(function(Rides)
    { var response = {"status":1,"message":"Ride Stop","data":{"status":status}};
     console.log("Ride Stop");   
    res.send(response);

    }).catch(next);
});

// Rate User

routes.post('/RateUser',function(req,res,next){
    var rideid = req.body.rideid;
    var recieveAmount = req.body.recievedAmount ;
    var userRating = req.body.userRating;
    Rides.update({_id:req.body.rideid},{$set:{ userRating:userRating,RecieveAmount:recieveAmount }},{w:1}).then(function(Rides)
    { var response = {"status":1,"message":"Thanks For Our Precious  Time","data":{}};
        res.send(response);

    }).catch(next);

});

// calculate Fair 
routes.post('/Result',function(req,res,next){
    console.log('Rideid'+req.body.rideid);
     Rides.findOne({_id:req.body.rideid},
 {
     pickupLongitude:1,
     pickupLatitude:1,
     dropoffLatitude:1,
     dropoffLongitude:1,
     pickupTime:1,
     dropofftime:1,
})
    .then(function (Rides) {
         var distance = Math.round(geodist(
             {lat: Rides.pickupLatitude, lon: Rides.pickupLongitude}, 
             {lat: Rides.dropoffLatitude, lon: Rides.dropoffLongitude},
              {exact: true, unit: 'km'}
            ));
        
          var date1 =new Date (Rides.pickupTime);
          console.log(date1);
          var date2 = new Date(Rides.dropofftime);
          var TimeDiff = Math.round( ( (date2.getTime() - date1.getTime())/60000)); // answer is in milliseconds 
          var km = 17;
          var permint = 2;
          var base = 130;
          var Fair =((distance*km)+(permint*TimeDiff))+base; 
          var roundoff= Math.round(Fair);
          var totalResponce = {
              "km":km,
              "permint":permint,
              "base":base,
              "Fair":roundoff,
              "time":TimeDiff,
              "TotalDistance":distance
             };
             var roundofftostring = roundoff.toString();
             console.log('bill :'+roundofftostring);
          
            // Rides.update({_id:req.body.rideid},{$set:{bill:roundoff}});
          var response = {"status":1,"message":"Result","data":{"total":totalResponce}};
          Rides.update({_id:req.body.rideid},{$set:{ bill:roundofftostring }}); 
          res.send(response);

        }).catch(next);
    
});


// Checking API
routes.post('/singleRide',function(req,res,next){
    var rideid = req.body.rideid;
  Rides.find({_id:rideid}).then(function (Rides) {
    var response = {"status":1,"message":"User Data","data":{"":Rides.status}};
    res.json(response);
    console.log("Single user access");
    }).catch(next);
});

// Captain get Its all  completed rides   (Send Captain id )

routes.post('/getallCaptainRides',function(req,res,next){
     var driverid =req.body.driverid;
        Rides.aggregate([
           
           
            { $match :{
                 $and:[ 
                     {"status": 5} ,
                     {"driverid":driverid}
                ]
                }
            },
            {
                
              $lookup:
                {
                  from: "users",
                  localField: "userPhoneNumber",
                  foreignField: "phoneNumber",
                  as: "User_data"
                }
           }
        
        ]).then(function (Rides) {
            var response = {"status":1,"message":"User Data","data":{Rides}};
            res.json(response);
            console.log("Driver Checking Its Rides");
         }).catch(next);
        });


//upload a Image 
// give a name sampleFile,driverid


routes.post('/upload', function(req, res) {
    var driverid = req.body.driverid;
    const serverName = require("os").hostname();
    const port = process.env.PORT || '4000';
    var  ImageUrl = '192.168.10.17'+':'+port+'/captain/getimage?image_name='+driverid+'.jpeg';
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
   
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('D:/Faizan Amin/API V1.0/Magno with Node.js/uploads/'+driverid+'.jpeg', function(err) {
      if (err)
        return res.status(500).send(err);
        Captain.update({_id:driverid},{$set:{imageUrl:ImageUrl}},{w:1}).then(function(Capatin)
      { 
        var response = {"status":1,"message":"Image uploaded","data":{ImageUrl}};
        res.send(response);

    })
    });
});

///

routes.get('/RideData',function(req,res,next){
    mongoose.miscellaneous.find({}).then(function () {
        res.json("hello World");
    }).catch(next);
});


 // get Image 

 routes.get('/getimage',(req,res,next)=>{
    let imageName = "uploads/"+ req.query.image_name;
    fs.readFile(imageName,(err,imageData)=>{
       if(err){
           var response = {"status":0,"message":"cant Not read Image","data":{}};
           res.send(response);
       }
       res.writeHead(200,{'Content-Type':'image/jpeg'});
       res.end(imageData);//send the file to browser.
    });    
});

//AmounT Recive By Caption
routes.post('/reciveAmount',function(req,res,next){
    var recieveAmount = req.body.recievedAmount ;
    var Bill = req.body.bill;
    console.log('RecieveAmount :'+recieveAmount);
    console.log('Bill :'+Bill);
    var Rideid = req.body.rideid ;
    Rides.update({_id:Rideid},{$set:{RecieveAmount:recieveAmount,bill :Bill}},{w:1}).then(function(Rides){
        var response = {"status":1,"message":"Amount Recieve","data":{}};
        res.send(response);
    }).catch(next);
});

// delete a captain
routes.delete('/api/:id',function(req,res,next){
    // res.send({type:"DELETE"});
    Captain.findByIdAndRemove({_id:req.params.id}).then(function (Captain) {
        res.send(Captain);
    }).catch(next);

});

// update a captain 
routes.put('/api/:id',function(req,res,next){
   // res.send({type:"UPDATE"});
    Captain.findByIdAndUpdate({_id:req.params.id},req.body).then(function () {
       Captain.findOne({_id:req.params.id}).then(function (Captain) {
         res.send(Captain)
       })
    }).catch(next)
});
module.exports= routes; 