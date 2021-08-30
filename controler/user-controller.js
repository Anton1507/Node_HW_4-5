const UserService = require('../service/user-service')
const {validationResult}=require('express-validator')
const ApiError=require('../exceptions/api-errors')
class UserController {
    async registration (req,res,next){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }
            const {email,password,role} = req.body;
            const userData = await UserService.registration(email,password,role);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:86400000,httpOnly:true});
            return res.json(userData);
        }catch(e){
            next(e)
        }
    }
    async login (req,res,next){
        try{
            const {email,password}= req.body;
            const userData=await UserService.login(email,password);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:86400000,httpOnly:true});
            return res.json(userData);
        }catch(e){
            next(e)
            
        }
    }
    async logout (req,res,next){
        try{
            const {refreshToken}=req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)

        }catch(e){
            next(e)
            
        }
    }
    async main (req,res,next){
        try{
            const mainPage = await UserService.main();
            return res.send(mainPage);
           
        }catch(e){
            next(e)
        } 
    }
    async refresh (req,res,next){
        try{
            const {refreshToken}=req.cookies;
            const userData=await UserService.refresh(refreshToken);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:86400000,httpOnly:true});
            return res.json(userData);

        }catch(e){
            next(e)
        }
    }
    async welcome (req,res,next){
        try{
            const welcomePage= await UserService.welcome();
            return  res.send(welcomePage);
           
        }catch(e){
            next(e)
        }
    }
    async errorRoute(req,res,nex){
        try{
            const ErrorPage=await UserService.errorRoute()
            return res.send(ErrorPage)

        }catch{
            next(e)
        }
    }


}

module.exports = new UserController();