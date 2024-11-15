import mongoose, {Schema, Document} from 'mongoose';
import { IUser } from './User';
import { IBlogPost } from './BlogPost';
import { timeStamp } from 'console';

export interface ILike extends Document{
    user: IUser['_id'];
    post: IBlogPost['_id'];
    createdAt: Date;
}

const LikeSchema: Schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User', required: true},
    post: {type: Schema.Types.ObjectId, ref:'BlogPost', required: true},
},
{timestamps: {createdAt: true, updatedAt: false}}
);

export default mongoose.model<ILike>('Like', LikeSchema);