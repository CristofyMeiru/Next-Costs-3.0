import mongoose, { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
    username: string;
    email: string;
    pass: string;
    created_at: Date;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true,
        select: false
    },
    created_at: {
        type: Date,
        require: true,
        default: Date.now()
    }
})
   
const User = model<IUser>("user", userSchema)
export default User