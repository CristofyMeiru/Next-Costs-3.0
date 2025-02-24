import mongoose, { Document, Schema, model } from 'mongoose'

interface IProject extends Document {
    title: string;
    category: 'Infraestrutura' | 'Design' | 'Desenvolvimento';
    budget: number;
    budget_used: number
    content: string;
    created_at: Date;
    author: mongoose.Types.ObjectId
}

const projectSchema = new Schema<IProject>({
    title: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    budget: {
        type: Number,
        require: true
    },
    budget_used: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
})

const Project = model<IProject>('project', projectSchema)
export default Project