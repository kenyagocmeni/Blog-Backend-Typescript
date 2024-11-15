import {Request, Response} from "express";
import Comment from "../models/Comment";
import BlogPost from "../models/BlogPost";
import Like from "../models/Like";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request{
    user?:{
        _id: string;
    };
}

//Yorum ekleme işlemi:
export const addComment = async (req:AuthenticatedRequest, res:Response):Promise<void> =>{

    const {content} = req.body;
    const {postId} = req.params;

    try {
        const blogPost = await BlogPost.findById(postId);
        if(!blogPost){
            res.status(404).json({message:"Blog post bulunamadı."});
            return;
        }

        //Yeni yorumun oluşturulup kaydedilmesi:
        const newComment = new Comment({
            content,
            author: req.user?._id,
            post: postId,
        });

        await newComment.save();

        res.status(201).json({message:"Yorum başarıyla eklendi.",comment:newComment});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};

export const deleteComment = async(req:AuthenticatedRequest, res:Response):Promise<void> =>{

    const {commentId} = req.params;

    try {
        
        //Yorumun bulunup yazarının kimlik doğrulamasından geçip geçmemesi:
        const comment = await Comment.findOneAndDelete({_id:commentId, author: req.user?._id});

        if(!comment){
            res.status(404).json({message: "Yorum bulunamadı ya da buna yetkiniz yok."});
            return;
        }

        res.status(200).json({message:"Yorum başarıyla silindi."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};

//Yorum yanıtlama işlemi:
export const replyToComment = async(req:AuthenticatedRequest, res:Response):Promise<void> =>{

    const {content} = req.body;
    const {commentId} = req.params;

    try {
        
        const parentComment = await Comment.findById(commentId);
        if(!parentComment){
            res.status(404).json({message:"Yorum bulunamadı"});
            return;
        }

        const replyComment = new Comment({
            content,
            author: req.user?._id,
            post: parentComment.post,
        });

        await replyComment.save();

        res.status(201).json({message:"Yanıt başarıyla eklendi"});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası", error});
    }

};

export const toggleLike = async(req:AuthenticatedRequest, res:Response):Promise<void> =>{

    const {postId} = req.params;

    try {
        
        const existingLike = await Like.findOne({post: postId, user: req.user?._id});
        
        if(existingLike){
            await existingLike.deleteOne();
            res.status(200).json({message:"Beğeni kaldırıldı."});
        }else{
            //Beğeni yoksa beğeni eklenmesi:
            const newLike = new Like({
                post: new mongoose.Types.ObjectId(postId),
                user: req.user?._id,
            });

            await newLike.save();
            res.status(201).json({message:"Beğeni eklendi."});
        }

    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};