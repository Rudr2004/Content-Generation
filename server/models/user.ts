import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string; // keep original UUID as _id
  email: string;
  passwordHash: string;
  role: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String }, // Use existing UUID as _id to preserve IDs
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: 'content_admin' },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
