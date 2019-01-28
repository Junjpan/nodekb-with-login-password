//use mongoose to make mongodb more structure.

let mongoose=require('mongoose');

//article schema
let articleSchema=mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }
});

let Article=module.exports=mongoose.model("Article",articleSchema)
//models are defined by passing a Schema instance to mongoose.model and Article is the modulename
