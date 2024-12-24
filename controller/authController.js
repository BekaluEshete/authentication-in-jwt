const User = require('../model/user');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');


const handleError = (error) => {
  let errors = { email: '', password: '' };


  if (error.code === 11000) {
    errors.email = 'This email is already registered';
    return errors;
  }

  if (error.errors) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
//creating the token  for requesting the server
const maxAge=24*3*60*60;
 const CreateToken=(id)=>{
  return jwt.sign({id},"the secret",{expiresIn:maxAge})
 }


module.exports._getSignup = (req, res) => {
  res.render("signup");
};


module.exports._getLogin = (req, res) => {
  res.render("login");
};


module.exports._postSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token=CreateToken(user._id);
    res.cookie('jwt',token,{httpOnly:true});
   
    res.status(201).json({user:user._id});
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json({ errors });
  }
};

// Login POST controller
module.exports._postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = CreateToken(user._id);
    res.cookie('jwt', token, { httpOnly: true });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = { email: '', password: '' };

    if (error.message === 'Invalid email') {
      errors.email = 'Email not registered';
    } else if (error.message === 'Incorrect password') {
      errors.password = 'Incorrect password';
    }

    res.status(400).json({ errors });
  }
};
module.exports._getLogout = (req, res) => {
 res.cookie('jwt','',{maxAge:1});
 res.redirect('/')
};
 
