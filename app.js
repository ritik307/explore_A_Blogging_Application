const express=require("express"),
	  app=express(),
	  bodyParser=require("body-parser"),
	  mongoose=require("mongoose"),
	  methodOverride=require("method-override"),
	  expressSanitizer=require("express-sanitizer"); // to sanitize the app (corona ki vajah se karna padha JK) to not allow user to execute scripts in the body section. 
	  

mongoose.connect("mongodb://localhost/blog_app",{
	useNewUrlParser:true,
	useUnifiedTopology:true
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //always used after bodyparser.
app.set("view engine","ejs");
app.use(methodOverride("_method")); //what to look for in the action for put/delete req

var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"My pet",
// 	image:"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=360&q=80",
// 	body:"he is so cute"
// });
app.get("/",(req,res)=>{
	res.redirect("/blogs");
});

//Index
app.get("/blogs",(req,res)=>{
	
	Blog.find({},function(err,blogs){
		if(err){
			console.log("error finding");
			//console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
	//res.render("index");
});

app.get("/blogs/new",(req,res)=>{
	res.render("new");
});

//Create
app.post("/blogs",(req,res)=>{
	
	req.body.blog.body=req.sanitize(req.body.blog.body); //req.body(bcz we want to access blog body) blog.body(bcz blog["body"]) the content we want to sanitize
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
			res.render("/new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});



app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//Edit
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

//Update
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body); //req.body(bcz we want to access blog body) blog.body(bcz blog["body"]) the content we want to sanitize
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,UpdateBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Delete
app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000,()=>{
	console.log("go goa gone!!");
});
