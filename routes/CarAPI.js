var express = require('express');
var routes = express.Router();
var validator = require('validator');
var Car = require('../moduls/car');
var fs = require('fs');

// get a list of Car
routes.get('/api',function(req,res,next){
    //res.send({type:"GET"});
    Car.find({}).then(function (Car) {
        res.send(Car)
    }).catch(next);
});

// add a new Car
routes.post('/api',function(req,res,next){
    var carid = req.body._id;
    Car.create(req.body).then(function(Car)
    { var responce = {"status":0,"message":"Sucess","data":{"Carid":carid}};
        res.send(responce);

    }).catch(next);
});
//upload a Image 
// give a name sampleFile,carid


routes.post('/upload', function(req, res) {
    var carid = req.body.carid;
    const serverName = require("os").hostname();
    const port = process.env.PORT || '4000';
    var  ImageUrl = serverName+':'+port+'/car/getimage?image_name='+carid+'.jpeg';
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
   
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('C:/Users/faizan/Desktop/API/Magno with Node.js/uploads/'+carid+'.jpeg', function(err) {
      if (err)
        return res.status(500).send(err);
        Car.update({_id:carid},{$set:{imageUrl:ImageUrl}},{w:1}).then(function(Car)
      { 
        var response = {"status":1,"message":"Image uploaded","data":{ImageUrl}};
        res.send(response);

    })
    });
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



// delete a Car
routes.delete('/api/:id',function(req,res,next){
    // res.send({type:"DELETE"});
    Car.findByIdAndRemove({_id:req.params.id}).then(function (Car) {
        res.send(Car);
    }).catch(next);

});
routes.put('/api/:id',function(req,res,next){
    // res.send({type:"UPDATE"});
    Car.findByIdAndUpdate({_id:req.params.id},req.body).then(function () {
        Car.findOne({_id:req.params.id}).then(function (Car) {
            res.send(Car)
        })
    }).catch(next)
});
module.exports= routes;