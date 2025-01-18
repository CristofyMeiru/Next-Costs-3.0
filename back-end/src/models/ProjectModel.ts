import mongoose, { Document, Schema, model } from 'mongoose'

interface IProject extends Document {
    title: string;
    category: 'Infraestrutura' | 'Design' | 'Desenvolvimento'
    content: string;
    created_at: Date;
    user_id: mongoose.Types.ObjectId
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
    content: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
})

const ProjectModel = model<IProject>('project', projectSchema)
export default ProjectModel