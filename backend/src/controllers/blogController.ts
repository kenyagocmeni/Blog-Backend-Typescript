import {Request, Response} from "express";
import BlogPost from "../models/BlogPost";

interface AuthenticatedRequest extends Request{
    user?:{
        _id: string;
    };
}

export const createBlogPost = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{

    const {title, content, tags} = req.body;

    try {
        
        const newBlogPost = new BlogPost({
            title,
            content, 
            author: req.user?._id,
            tags,
        });

        await newBlogPost.save();

        res.status(201).json({message:"Blog post başarıyla oluşturuldu."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası", error});
    }

};

export const updateBlogPost = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    
    const {title, content, tags} = req.body;
    const {id} = req.params;

    try {
        
        const blogPost = await BlogPost.findOne({_id: id, author:req.user?._id});
        if(!blogPost){
            res.status(404).json({message: "Blog post bulunamadı ya da yetkiniz yok."});
            return;
        }

        if(title) blogPost.title = title;
        if(content) blogPost.content = content;
        if(tags) blogPost.tags = tags;

        await blogPost.save();

        res.status(200).json({message:"Blog post başarıyla güncellendi."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};

export const deleteBlogPost = async(req: AuthenticatedRequest, res:Response):Promise<void> =>{
    const {id} = req.params;

    try {
        //Blog yazısının bulunup yazarının kimliği doğrulanan kullancı olup olmadığının kontrolü:
        const blogPost = await BlogPost.findOneAndDelete({_id:id, author: req.user?._id});
        if(!blogPost){
            res.status(404).json({message:"Blog post bulunamadı ya da yetkiniz yok."});
            return;
        }

        res.status(200).json({message:"Blog post başarıyla silindi."});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }
};

export const searchBlogPosts = async(req:Request, res:Response):Promise<void> =>{

    const {author, startDate, endDate, tags, sortBy} = req.query;

    try {
        
        //Filtreler için sorgu nesnesi oluşturulması:
        const query: any={};

        //Yazar filtrelemesi:
        if(author){
            query.author = author;
        }

        //Tarih aralığı filtrelemesi:
        if(startDate || endDate){
            query.createdAt = {};
            if(startDate) query.createdAt.$gte = new Date(startDate as string);
            if(endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        //Etiket filtresi:
        if(tags){
            query.tags = {$in: (tags as string).split(",")};
        }

        //Sıralama (popülerlik ya da tarih)
        let sortCriteria = {};
        if(sortBy === "popularity"){
            sortCriteria = {likes: -1};//Beğeni sayısına göre azalan sırayla
        }else if(sortBy === "date"){
            sortCriteria = {createdAt: -1};//Tarihe göre azalan sırayla
        }

        const blogPosts = await BlogPost.find(query).sort(sortCriteria);

        res.status(200).json({blogPosts});
    } catch (error: any) {
        res.status(500).json({message:"Sunucu hatası",error});
    }

};

export const uploadBlogImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
  
    try {
      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
  
      blogPost.image = req.file.path;
      await blogPost.save();
  
      res.status(200).json({ message: 'Blog image uploaded successfully', image: blogPost.image });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };