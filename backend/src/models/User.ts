import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username:{ type: String, required: true, unique: true},
    email:{ type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePicture: { type: String},
},
{timestamps: true}
);

UserSchema.index({email:1},{unique:true});

export default mongoose.model<IUser>('User', UserSchema);