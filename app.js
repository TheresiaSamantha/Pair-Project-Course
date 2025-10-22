const express = require("express");
const Controller = require("./controllers/controller");
const UserController = require('./controllers/userController')
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// setting user
//register
// app.get('/register', UserController.registerForm)
// app.post('/register', UserController.postRegister)

//login
// app.get('/login', UserController.loginForm)
// app.post('/login', UserController.postLogin)

//controll
app.get("/", Controller.landingPage);

app.get("/courses", Controller.readCourse); // ada search
// role admin
app.get("/courses/add", Controller.getAdd);
app.post("/courses/add", Controller.postAdd);
app.get("/courses/delete/:id", Controller.delete);

// role student
app.get("/students/edit/:id", Controller.getEdit);
app.post("/students/edit/:id", Controller.postEdit);
app.get("/students/:id", Controller.studentDetail);//menampilkan detail student dan ada course dimiliki


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});