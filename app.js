//resources from https://www.youtube.com/watch?v=k_0ZzvHbNBQ&list=PLQUnT_yGzhwZXy_WEUlvd3w5Nid8nrQl8&index=5&t=0s

const express=require("express");
const path=require("path");// path is already in node_modules ,that is why you don't need to install first
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const config=require('./config/database');

//connect to the database-mongodb-nodekb database,locahost is equarl to 127.0.0.1, once you open the mongod.exe(shell) and then mongodb.exe, the database is connected to localhost and the default port is 27017
mongoose.connect(config.database);
//(node:2088) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
let db=mongoose.connection;
//check connection
db.once("open",function(){
  console.log('connected to Mongodba')
})

// check for DB errros;
db.on("error",function(err){
  console.log(err);
})

// init app
const app=express();

//Bring in mongoose models
let Article=require('./modules/articles')


//load view engine. __dirname mean current directory.open current folder called views
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");//before the view engine called pug, it is called jade.

//parse application/x-www-form-urlencoded
// parse incoming request bodies in a middleware before your handlers,you get receive the information in the under the req.body prperty
app.use(bodyParser.urlencoded({extended:false}));

//parse application/json
app.use(bodyParser.json());

//Set public folder and let express konow that folder is holding static information. and want to use this folder for the frontend 
app.use(express.static(path.join(__dirname,"public")));

//Express session Middleweare
app.use(session({
  secret: 'keyboard cat',// you can put any whatever you want here
  resave: true,  //related to the flash
  saveUninitialized: true
}))

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});//set gobal variable messages to express-messages modules

//express validator Middleweare
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);

//Passport Middleweare.In a Connect or Express-based application, passport.initialize() middleware is required
// to initialize Passport. If your application uses persistent login sessions, passport.session() middleware must also be used.

app.use(passport.initialize());
app.use(passport.session());

//set up gobal variable-user
app.use('*',(req,res,next)=>{
  res.locals.user=req.user||null; //once user login, req.user is available.
  next(); //call next piece of middleware
})


// home route
app.get('/',(req,res)=>{

Article.find({},function(err,articles){
if (err){
  console.log(err);
}else{
  //console.log(articles);
  res.render("index",{
     title:"Articles",
     articles:articles
   });
}
});
});

// Bring into the route files.
let articles=require('./routes/articles');
let users=require('./routes/users');
app.use("/articles",articles); //mean everything has route /articles need to go to articles.file
app.use('/users',users);
//start server
app.listen(9000,function(){
  console.log("server stared on port 9000");
})
