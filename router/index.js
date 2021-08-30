const Router = require("express").Router;
const userController = require("../controler/user-controller")
const router = new Router();
const {body}=require('express-validator');
const authMiddleware=require('../middlewares/auth-middleware');
const Role = require('../dtos/roles');
router.get('/main',userController.main)
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}), 
    userController.registration

    )
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/refresh',userController.refresh)
router.get('/welcome',authMiddleware(Role.Admin),userController.welcome)
router.get('/*',userController.errorRoute)

module.exports=router