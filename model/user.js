const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt=require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    lowercase: true,
   unique: [true,'the email is already registered'],
    validate: {
      validator: isEmail,
      
      message: 'Please enter a valid email',
    },
  },
  password: {
    type: String,
    minlength: [6, 'Please enter at least six characters'],
    required: [true, 'Please enter a password'],
  },
});
// fire function after the doc is saved
// userSchema.post('save',function (doc,next){
//   console.log("new user was added ",doc);
//   next();
  
// });
// fire function before
//  userSchema.pre('save',function(next){
//   console.log("new user was created",this);
  
//   next();
//  });
///////////////////////        hasing ///

 userSchema.pre('save',async function(next){
 const salt= await bcrypt.genSalt();
 this.password= await bcrypt.hash(this.password,salt);
 

  next();
 })
 userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); // Corrected 'this.findOne'
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // Use 'user.password'
    if (auth) {
      return user;
    }
    throw new Error('Incorrect password');
  }
  throw new Error('Invalid email');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
