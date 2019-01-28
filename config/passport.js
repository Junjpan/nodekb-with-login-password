const LocalStrategy=require('passport-local').Strategy;
const User=require('../modules/user');
const config=require('../config/database');
const bcrypt=require('bcryptjs');

module.exports=function(passport){
//local Strategy
passport.use(new LocalStrategy(function(username,password,done){
// match Username
let query={username:username};
User.findOne(query,function(err,user){
  if(err){
    throw err;
  } if(!user){
    return done(null,false,{message:"No User found"})
  }
//Match password
bcrypt.compare(password,user.password,function(err,isMatch){
if(err) throw err;

if (isMatch){
  console.log(isMatch);
  return done(null,user);
}else{
  return done(null,false,{message:"Wrong Password!"})
}
})
})
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



}
