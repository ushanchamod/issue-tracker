import mongoose, { Document, Schema } from "mongoose";

export interface UserType extends Document {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  hash?: string;
}

const UserSchema: Schema = new Schema<UserType>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  hash: { type: String, required: false },
});

export const UserModel = mongoose.model<UserType>("User", UserSchema);
