var express = require('express');
var routes = express.Router();
var validator = require('validator');
var User = require('../moduls/user');
var Captain = require('../moduls/captain');
var Rides = require('../moduls/rides');
var fs = require('fs');
var geodist = require('geodist');
const fileUpload = require('express-fileupload');

// get a list of users
routes.get('/api',function(req,res,next){
    User.find({}).then(function (User) {
        res.json(User)
    }).catch(next);
});

// get a single user
routes.post('/singleuser',function(req,res,next){
    var userid = req.body.userid
  User.find({_id:userid}).then(function (User) {
    var response = {"status":1,"message":"User Data","data":User[0]};
    res.json(response);
    console.log("Single user access");
    }).catch(next);
});

//add a new user with validation 
//  routes.post('/api',function(req,res,next){
//      var password = req.body.password;
//      var email = req.body.email;
//      var userName = req.body.userName ;
//      var uservalid = validator.isEmpty(userName);
//      var passIsValid = validator.isLength(password,{min:4});
//      var emailIsValid = validator.isEmail(email);
     
//  if (emailIsValid && passIsValid) {
     

//       User.create(req.body).then(function(User)
//       {  var userid = User._id;
//          console.log(User); 
//          var response = {"status":1,"message":"Success","data":{userid}};
//          res.json(response);
//       }).catch(next);
      
//   } else if (!emailIsValid) {
//          var response = {"status":0,"message":"Email invalid","data":{}};
//          res.json(response);
//   }
//    else if (!uservalid) {
//     var response = {"status":0,"message":" please enter a username","data":{}};
//     res.json(response);
// } else if (!passIsValid) {
//       var response = {"status":0,"message":"password invalid","data":{}};
//     res.json(response);
//   }
//  });




/// alag Kam 
routes.post('/api',function(req,res){
         var password = req.body.password;
         var email = req.body.email;
         var userName = req.body.userName ;
         var uservalid = validator.isEmpty(userName);
         var passIsValid = validator.isLength(password,{min:4});
         var emailIsValid = validator.isEmail(email);
    if (req.body.userName == null || req.body.userName == '' ){
        var responce = {"status":"False","message":"Please Provide UserName!"};
        res.send(responce);
        }
    else{
        if(passIsValid && emailIsValid){
            User.create(req.body,function(err){
                if(err){
                    var responce = {"status":"False","message":"Email allready Exists!"};
                    res.send(responce);
                }
                else{
                    var responce = {"status":"ture","message":"User Created","data":{}};
                    res.send(responce);
                }
                            
        
            });
        }
        else if (!emailIsValid) {
            var response = {"status":0,"message":"Email invalid","data":{}};
            res.json(response);
     }
     else if (!uservalid) {
        var response = {"status":0,"message":" please enter a username","data":{}};
        res.json(response);
    } else if (!passIsValid) {
          var response = {"status":0,"message":"password invalid","data":{}};
        res.json(response);
      }
        
    }
   
});

// User checking its Ride Status   
routes.post('/ridestatus',function(req,res,next){
    var rideid = req.body.rideid;
    Rides.findOne({_id:rideid},{driverid:1,status:1}).then(function (Rides) {
        var driverid = Rides.driverid ;
        Captain.find({_id:driverid}).then(function (Captain) {
            var response = {"status":1,"message":"User Data","RideStatus":Rides.status,"data":Captain[0]};
            res.json(response);
            console.log("User Checking Its Ride Status");
            })
     }).catch(next);
    });


    // FAIR 

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
             Rides.update({_id:req.body.rideid},{$set:{bill:roundoff}});
          var response = {"status":1,"message":"Result","data":{"total":totalResponce}};
           res.json(response);
        }).catch(next);
    
});

 

// User get Its all rides   (Send user id)

routes.post('/getalluserRides',function(req,res,next){

    Rides.find({
        userid:req.body.userid, $or: [{ status: 0 } , { status: 5 }]}).then(function (Rides) {
        var username =User.userName;
        var response = {"status":1,"message":"All ride","data":{Rides}};
        res.send(response)
    }).catch(next);
});


// Rate Capatin
routes.post('/RateCaptain',function(req,res,next){
    var captainRating = req.body.captainRating;
    var  rideStatus = false ;
    Rides.update({_id:req.body.rideid},{$set:{ captainRating: captainRating , isActive: rideStatus }},{w:1}).then(function(Rides)
    { var response = {"status":1,"message":"Captain Rating","data":{}};
        res.send(response);

    }).catch(next);

});

// delete a user
routes.delete('/api/:id',function(req,res,next){
    // res.send({type:"DELETE"});
    User.findByIdAndRemove({_id:req.params.id}).then(function (User) {
        res.send(User);
    }).catch(next);

});

//upload a Image 
// give a name sampleFile,userid


routes.post('/upload', function(req, res) {
    var userid = req.body.userid;
    const serverName = require("os").hostname();
    const port = process.env.PORT || '4000';
    var  ImageUrl = serverName+':'+port+'/user/getimage?image_name='+userid+'.jpeg';
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
   
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
   
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('C:/Users/faizan/Desktop/API V1.0/Magno with Node.js/uploads/'+userid+'.jpeg', function(err) {
      if (err)
        return res.status(500).send(err);
        User.update({_id:userid},{$set:{imageUrl:ImageUrl}},{w:1}).then(function(User)
      { 
        var response = {"status":1,"message":"Image uploaded","data":{ImageUrl}};
        res.send(response);

    })
    });
  });
 // get Image 

 routes.get('/getimage',(req,res,next)=>{
     let imageName = "uploads/"+ req.query.image_name;
     console.log(imageName);
     fs.readFile(imageName,(err,imageData)=>{
        if(err){
            var response = {"status":0,"message":"cant Not read Image","data":{}};
            res.send(response);
        }
        res.writeHead(200,{'Content-Type':'image/jpeg'});
        res.end(imageData);//send the file to browser.
     });    
 });


// Update a User
routes.post('/UpdateUser',function(req,res,next){
    var Userid = req.body.userid;
    User.findByIdAndUpdate({_id:Userid},req.body).then(function (User) {
        var response = {"status":1,"message":"User Updated","data":{}};
        res.send(response);
        console.log("Update user");
        console.log("responce : "+response);
    }).catch(next)
});
module.exports= routes; 