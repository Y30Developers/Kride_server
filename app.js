
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser= require('cookie-parser');
var exphbs = require('express-handlebars');
var validator = require('validator');
var expressValidation = require('express-validation');
var expressvalidator = require('express-validator');
var flash = require('connect-flash');
var fs = require('fs');
var session =require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
const fileUpload = require('express-fileupload');
var app = express();
var port = process.env.PORT || 5000;
//connect to mongodb
mongoose.connect('mongodb://localhost:27017/userdata',{
useMongoClient:true} );

mongoose.Promise =global.Promise; 

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

   app.use(express.static(path.join(__dirname,'public')));


   app.use(fileUpload());
// Express Session 
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

// express validator
app.use(expressValidation({
    errorFormatter:function(param,msg,value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root ;
        while(namespace.lenght){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param :formParam,
            msg : msg ,
            value : value
        };
    }
}));
app.use(passport.initialize());
app.use(passport.session());
// Connect Flash 
app.use(flash());
// passport 

// global varibles
app.use(function (req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/user',require('./routes/UserAPI'));
app.use('/captain',require('./routes/CaptainAPI'));
app.use('/rides',require('./routes/RidesAPI'));
app.use('/creditcard',require('./routes/creditcardAPI'));
app.use('/car',require('./routes/CarAPI'));
app.use('/login',require('./routes/login'));
app.use(function (err, req, res, next) {
    res.send({error: err.message})
});
app.get('/',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.readFile('./view/index.html',null,function(error,data){
        if(error){
            res.writeHead(404);
            res.write('File Not Found');
        }else {
            res.write(data);
        }
res.end();
    });
});
app.listen(port,function(){
    console.log("server Runnig On port " +port);
    console.log("Server Started.....");
});