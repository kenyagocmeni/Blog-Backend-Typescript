import mongoose, {Schema, Document} from 'mongoose';
import { IUser } from './User';
import { IBlogPost } from './BlogPost';

export interface IComment extends Document{
    content: string;
    author: IUser['_id'];
    post: IBlogPost['_id'];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: {type: String, required: true},
    author:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: Schema.Types.ObjectId, ref:'BlogPost', required:true},
},
{timestamps: true}
);

// Post alanında indeks (belirli bir blog yazısının yorumları için)
CommentSchema.index({ post: 1 });

// Author alanında indeks (belirli bir kullanıcının yaptığı yorumlar için)
CommentSchema.index({ author: 1 });

// CreatedAt alanında indeks (yorumları tarihe göre sıralamak için)
CommentSchema.index({ createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);