import mongoose, { Document, Schema, model } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken';

export interface IAuthToken extends JwtPayload {
    userID?: string
}

interface IRefresh extends Document {
    payload: string;
    user: mongoose.Types.ObjectId
    expiresAt: Date
}

const refreshSchema = new Schema<IRefresh>({
    payload: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    expiresAt: {
        type: Date,
        require: true
    }
})

const RefreshToken = model<IRefresh>('refresh_token', refreshSchema)
export default RefreshToken