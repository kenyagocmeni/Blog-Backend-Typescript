import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User, {IUser} from '../models/User';

export default interface AuthenticatedRequest extends Request{
    user?: IUser;
}

//Kimlik doğrulama middlewarei:
export const authenticateToken = async(req:AuthenticatedRequest, res:Response, next:NextFunction): Promise<void> =>{
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        res.status(401).json({message:"Erişim reddedildi: Token sağlanamadı"});
        return;
    }

    try {
        //Token doğrulaması:
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {id:string};

        //Kullanıcının veritabanında aranıp isteğe eklenmesi:
        const user = await User.findById(decoded.id);
        if(!user){
            res.status(404).json({message: 'Kullanıcı bulunamadı.'});
            return;
        }

        req.user = user; //Kullanıcı bilgisinin isteğe eklenmesi
        next();

    } catch (error: any) {
        res.status(401).json({message:'Geçersiz token.'});
    }

};