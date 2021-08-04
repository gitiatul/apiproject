const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _= require('lodash');
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
const PORT=process.env.PORT;

app.use(express.static("public"));


const DB=process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(function(){
    console.log("database connected");
}).catch((err) => console.log("DB not connected"));


const articleSchema={
      first_name:String,
      last_name:String
}
const Article = mongoose.model('Article',articleSchema);

app.route("/article")
.get( async function(req,res){

  let page=parseInt(req.query.page);
  let limit=parseInt(req.query.limit);

  if(!page){
    page=1;
  }
  if(!limit){
    limit=4;
  }
  const skip=(page-1)*limit;

  const data=await Article.find().skip(skip).limit(limit);
  const total=await Article.find().count();
  const total_page=Math.round(total/limit);
  const Made_by={
    name:"Atul Balodi"
  }
  const article={
    page,
    limit,
    total,
    total_page,
    data,
    Made_by
  }
  res.send(article);  
})
.post(function (req,res){
  const first_namename=_.capitalize(req.body.first_name);
  const last_namename=req.body.last_name;
  const article=new Article({
    first_name:first_namename,
    last_name:last_namename
  })
  article.save(function (err) {
    if(!err){
      res.send("success");
    }
  })
})
.delete(function (req,res) {
  Article.deleteMany(function(err){
    if(!err){
       res.send("Deleted all post")
    }
  })
})

app.route("/article/:post")
.get(function(req,res){
  const reqpost=_.capitalize(req.params.post);
  Article.findOne({first_name:reqpost},function(err,foundpost){
    if(!err){
      res.send(foundpost);
    }
  })
})

.put(function (req,res) {
  const reqpost=_.capitalize(req.params.post);
  const first_namename=_.capitalize(req.body.first_name);
  const last_namename=req.body.last_name;
  Article.update(
    {first_name:reqpost},
    {first_name:first_namename,last_name:last_namename},
    {overwrite:true},
    function(err){
    if(!err){
      res.send("Updated Successfully")
    }
  })
})

.patch(function (req,res) {
  const reqpost=_.capitalize(req.params.post);
  const first_namename=_.capitalize(req.body.first_name);
  const last_namename=req.body.last_name;
  Article.update(
    {first_name:reqpost},
    {first_name:first_namename,last_name:last_namename},
    {overwrite:false},
    function(err){
    if(!err){
      res.send("Updated Successfully")
    }
  })
})

.delete(function (req,res) {
  const reqpost=_.capitalize(req.params.post);
  const first_namename=_.capitalize(req.body.first_name);
  Article.deleteOne(
    {first_name:reqpost},
    function(err){
    if(!err){
      res.send("Deleted Successfully")
    }
  })
})

app.listen(PORT,function(){
  console.log("server started");
})
