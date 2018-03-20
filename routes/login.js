var express = require('express');

var routes = express.Router();

var Signup = require('../moduls/user');
var Signup2 = require('../moduls/captain');

 
routes.get('/api',function(req,res,next){
 
    res.send('wellcome user');
    

})
 

// user login

routes.post('/User',function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;

 

    Signup.findOne({email: email, password: password}).then(function(Signup)
    {  
        if(!Signup){
            var response = {"status":0,"message":"Invalid Username Or Password","data":{}};
            return res.send(response);

        }
else{
        var userid=Signup._id;
        var username =Signup.userName;
        var response = {"status":1,"message":username,"data":{"Userdata":Signup}};
        console.log(response);
        return res.json(response);
    
}
    }).catch(next);

});


// Capatin Login

routes.post('/Captain',function(req,res,next){
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;

 

    Signup2.findOne({phoneNumber: phoneNumber, password: password}).then(function(Signup2)
    {  
        if(!Signup2){
            var response = {"status":0,"message":"Invalid Username Or Password","data":{}};
            return res.send(response);

        }
else{
        var driverid=Signup2._id;
        var captainName =Signup2.captainName;
        var response = {"status":1,"message":"Wellcome : "+captainName,"data":{Signup2}};
        console.log(response);
        return res.json(response);
    
}
    }).catch(next);

});

module.exports= routes; 