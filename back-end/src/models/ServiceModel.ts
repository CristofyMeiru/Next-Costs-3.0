import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

interface IService extends Document {
  service_name: string;
  cost: number;
  description: string;
  responsible_username: string;
  project_id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  created_at: Date;
}

const serviceSchema = new Schema<IService>({
  service_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  responsible_username: {
    type: String,
    default: "No one",
  },
  project_id: {
    type: Schema.Types.ObjectId,
    default: "",
    ref: "projects",
  },
  author: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "users",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Service = model<IService>("services", serviceSchema);
export default Service;
