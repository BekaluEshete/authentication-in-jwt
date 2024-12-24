const {Router}=require('express');

const authController=require('../controller/authController');
const router=Router();
router.get('/signup',authController._getSignup);
router.post('/signup',authController._postSignup);
router.get('/signin',authController._getLogin)
router.post('/signin',authController._postLogin)
router.get('/logout',authController._getLogout)
module.exports=router;