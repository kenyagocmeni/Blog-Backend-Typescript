import mongoose, {Schema, Document} from "mongoose";
import { IUser } from "./User";

export interface IBlogPost extends Document{
    title: string;
    content: string;
    author: IUser['_id'];
    tags: string[];
    likes: number;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref:'User', required:true},
    tags: {type: [String], default:[]},
    likes: {type: Number, default:0},
    image: {type: String},
},
{timestamps: true}
);

// Author alanında indeks ekle (yazara göre arama işlemleri için)
BlogPostSchema.index({ author: 1 });

// CreatedAt alanında indeks ekle (tarihe göre sıralama için)
BlogPostSchema.index({ createdAt: -1 }); // Azalan sırayla sıralama

// Tags alanında çoklu indeks oluştur (birden fazla etikete göre arama için)
BlogPostSchema.index({ tags: 1 });
 
// Likes alanında indeks oluştur (popülerlik için sıralama yapılacaksa)
BlogPostSchema.index({ likes: -1 });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);