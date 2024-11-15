import {Request, Response} from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../middleware/authMiddleware";

//Kayıt işlemi:
export const registerUser = async(req: Request, res:Response):Promise<void>=>{
    const {username, email, password} = req.body;

    try {
        //Kullanıcı halihazırda var mı?
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({message:"Bu e-posta ile zaten kaydolunmuş."});
            return;
        }

        //Şifrenin hashlenmesi:
        const hashedPassword = await bcrypt.hash(password, 10);

        //Yeni kullanıcının oluşturulması:
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({message:"Kullanıcı başarıyla kaydoldu."});

    } catch (error: any) {
        res.status(500).json({message:"Server Error", error});
    }
};

//Kullanıcı girişi:
export const loginUser = async (req:Request, res:Response):Promise<void> =>{
    const {email, password} = req.body;

    try {
        //Kullanıcı var mı:
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message:"Böyle bir kullanıcı yok."});
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(400).json({message:"Geçersiz giriş bilgileri"});
            return;
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || '', {
            expiresIn:"1h",
        });

        res.json({message:"Hoşgeldiniz", token});
    } catch (error) {
        res.status(500).json({message:"Server Error", error});
    }
};

export const updateUserProfile = async(req:AuthenticatedRequest, res:Response):Promise<void> =>{

    const {username, email, password, profilePicture} = req.body;

    try {
        
        //Güncellenecek kullanıcının istekteki kullanıcının ID'si ile yakalama:
        const user = await User.findById(req.user?._id);
        if(!user){
            res.status(404).json({message:"Kullanıcı bulunamadı."});
            return;
        }

        //Alanların isteğe göre güncellenmesi:
        if(username) user.username = username;
        if(email) user.email = email;
        if(profilePicture) user.profilePicture = profilePicture;

        //Şifre güncellemesi varsa şifrenin hashlenmesi:
        if(password){
            user.password = await bcrypt.hash(password, 10);
        }

        //Güncellenmiş kullanıcının kaydedilmesi:
        await user.save();
        res.status(200).json({message:"Kullanıcı bilgileri başarıyla güncellendi."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};

export const uploadProfilePicture = async(req:AuthenticatedRequest, res:Response):Promise<void> =>{
    if(!req.file){
        res.status(400).json({message:"Yüklenmiş dosya yok"});
        return;
    }

    try {
        
        const user = await User.findById(req.user?._id);
        if(!user){
            res.status(404).json({message:"Kullanıcı bulunamadı."});
            return;
        }

        user.profilePicture = req.file.path;
        await user.save();

        res.status(200).json({message:"Profil resmi başarıyla yüklendi."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası:", error});
    }
};