const express=require('express');
const router=express.Router();

//bring in Article model
let Article=require('../modules/articles')// have to use../ to get outside of current folder
//bring the User model
let User=require('../modules/user');

//add route (mean the request route),render to the view page.
router.get('/add',ensureAutehnticated,(req,res)=>{
  res.render("add_articles",{title:"Please add an articles"});
})

//add submit POST route Post request mean add something to the server
router.post("/add",(req,res)=>{
  req.checkBody('title',"Title is required").notEmpty();// have to use validator Middleweare to be able to use this.
  //req.checkBody('author',"Author is required").notEmpty();
  req.checkBody('body',"Body is required").notEmpty();
//Get Errors
  let errors=req.validationErrors();
  if (errors){
    console.log(errors);
    res.render('add_articles',{
      title:"All the field need to be filled",
      errors:errors
    });
  } else {
    let article=new Article();
    article.title=req.body.title;
    article.author=req.user._id; // once you login we can find the info automatically for req.user
    article.body=req.body.body;
    //  console.log(req.body);
    //article.save(); mean save the add information to the database.
    article.save((err,data)=>{
      if (err){
        console.log(err);
      } else{
        console.log(data);// data will be the new add information to the db
        req.flash('success',"Article Added")
        res.redirect("/");
      }
    })

  }

})

//load Edit form
router.get('/edit/:id',ensureAutehnticated,(req,res)=>{
//console.log(req.params.id);
Article.findById(req.params.id,(err,article)=>{
  //console.log(article);
  if (article.author!=req.user._id)
  {req.flash('danger',"Not Authorize");
  res.redirect('/')  }else{
  res.render("edit_article",{
    title:"Edit Article",
    article:article});
}
})
})

//update Submit Post route
router.post('/edit/:id',(req,res)=>{
  let edit_Article={};
  edit_Article.title=req.body.title;
  edit_Article.author=req.body.author;
  edit_Article.body=req.body.body;
  console.log(edit_Article);
  let edit_id=req.params.id;
  Article.update({_id:edit_id},edit_Article,(err)=>{
    if (err){
      console.log(err);
      return;
    } else{
      req.flash("danger","Article Updated!")// bootstrap class success, has green gackground, if put danger, have red background
      res.redirect('/');
    }
  })
})

//delete article
router.delete("/:id",(req,res)=>{
  if (!req.user._id){//make sure user is login
    res.status(500).send();
  }
  let query={_id:req.params.id};

  Article.findById(req.params.id,(err,article)=>{
if (article.author!=req.user._id){
  res.status(500).send();
}else{
  Article.remove(query,function(err){
    if (err){
      console.log(err);
    } else{
      req.flash("danger","Article has been deleted!");
     //console.log(res.send("sucess"));
   res.send("sucess");// this refer to 200
  }
  })
}
  })
})

//get single article, you can use :id or different variable to received the req.params
router.get('/:id',(req,res)=>{
//console.log(req.params.id);
Article.findById(req.params.id,(err,article)=>{
  //console.log(article); article.author store the user id,which you can see the submot post above.
  User.findById(article.author,(err,user)=>{
    res.render("article",{article:article,
    author:user.name});
  })
})
})

//access controls any route you want to protect you can use this funtion
function ensureAutehnticated(req,res,next){
if (req.isAuthenticated()){// since we use passport, we can use req.isAuthenticated();
  return next();
}else{
  req.flash('danger','Please login');
  res.redirect('/users/login');
}

}

 module.exports = router;
