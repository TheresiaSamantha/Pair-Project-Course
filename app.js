const express = require("express");
const session = require('express-session')
const Controller = require("./controllers/controller");
const UserController = require('./controllers/userController')
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat', //harus ada
  resave: false,
  saveUninitialized: false,
  cookie: { 
	  secure: false,
	  sameSite: true // securitas dari csrf attack
   }
}))

// setting user
// register
app.get('/register', UserController.registerForm)
app.post('/register', UserController.postRegister)

// login
app.get('/login', UserController.loginForm)
app.post('/login', UserController.postLogin)

// all role
app.get("/", Controller.landingPage);

app.use(function(req,res,next){
	if(!req.session.userId){
		const error = 'Please login first'
		res.redirect(`/login?error=${error}`)
	} else {
		next()
	}
})

// logout
app.get('/logout', UserController.getLogout)

const isAdmin = (function(req,res,next){
	if(req.session.role !== 'admin'){
		const error = 'You have no access'
		res.redirect(`/?error=${error}`)
	} else {
		next()
	}
})

// role admin
app.get("/courses", isAdmin, Controller.readCourse);
app.get("/courses/add", isAdmin,Controller.getAdd);
app.post("/courses/add", isAdmin,Controller.postAdd);
app.get("/courses/delete/:id", isAdmin,Controller.delete);

// role student
app.get("/students/edit/:id", Controller.getEdit);
app.post("/students/edit/:id", Controller.postEdit);
app.get("/students/:id", Controller.studentDetail);

// invoice per course (student detail)
app.get("/students/:studentId/invoice/:courseId", Controller.invoiceCourse);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});