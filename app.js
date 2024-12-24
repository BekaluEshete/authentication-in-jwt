const express = require('express');
const mongoose = require('mongoose');
const route=require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const {requireAuth, checkUser}=require('./middleware/authmiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
const dbURI = 'mongodb+srv://bekelueshete:jfG0G2XYK4z9PyXQ@test.mad7o.mongodb.net/auth?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => {app.listen(3000);console.log('connected')})
  .catch((err) => console.log(err));

  

// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
// set cookies
// app.get('/cookies',(req,res)=>{
//   res.cookie('new User',false)
//   res.cookie('isStudent',true,{maxAge:1000*60*60*24,httpOnly:true},)
//   res.send('you got the cookie')
// })
// // read cookies

// app.get('/read-cookies',(req,res)=>{
//   cookie=req.cookies;
//   console.log(cookie);
//   res.json(cookie)
  
// })
app.use(route);