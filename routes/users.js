const express=require("express");
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//Bring in User model
let User=require('../modules/user');

//Register form
router.get('/register',function(req,res){
res.render('register');
})

//Register prrocess
router.post('/register',function(req,res){
const name=req.body.name;
const email=req.body.email;
const username=req.body.username;
const password=req.body.password;
const password1=req.body.password1;

req.checkBody('name',"Name is required").notEmpty();
req.checkBody('email',"Email is required").notEmpty();
req.checkBody('email',"Email is not valid").isEmail();
req.checkBody('username',"Username is required").notEmpty();
req.checkBody('password',"Password is required").notEmpty();
req.checkBody('password2',"Password do not match").equals(req.body.password);

let errors=req.validationErrors();
if(errors){
  console.log(errors)
  res.render('register',{
    errors:errors
  })
}else{
let newUser=new User({
name:name,
username:username,
email:email,
password:password
});

bcrypt.genSalt(10,function(err,salt){
  bcrypt.hash(newUser.password,salt,function(err,hash){
    if(err){
      console.log(err);
    }
newUser.password=hash;
newUser.save(function(err){
  if(err){
    console.log(err);
    return;
  }else{
req.flash('success','You are now registered and can log in');
res.redirect('/users/login');

  }
})
  });
})
}
})
// Login Form
router.get('/login',(req,res)=>{
  res.render('login');
})

router.post('/login',(req,res,next)=>{
  passport.authenticate('local', { successRedirect: '/',//local here mean use local strategy
                                   failureRedirect: '/users/login',
                                   failureFlash: true })(req,res,next);
})// If authentication succeeds,
//the next handler will be invoked and the req.user property will be set to the authenticated user.

//logout
router.get('/logout',(req,res)=>{
  req.logout();//invoking logout() will remove the req.user property and clear the login session(if any)
  req.flash('sucess',"You are logged out.");
  res.redirect('/users/login');
})
module.exports=router;
