import { Schema, model, type HydratedDocument } from "mongoose";
import { ProviderEnum, GenderEnum, RoleEnum } from "../../enums/user.enums.js";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  provider: ProviderEnum;
  confirmEmail: boolean;
  profilePicture: string;
  coverPicture: string[];
  age: number;
  phone: string;
  gender: GenderEnum;
  role: RoleEnum;
  changeCreditTime: Date;
}

export type IHUser = HydratedDocument<IUser>; 

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function (): boolean {
      return this.provider === ProviderEnum.System;
    },
  },
  provider: { type: Number, enum: ProviderEnum, default: ProviderEnum.System },
  confirmEmail: { type: Boolean, default: false },
  profilePicture: { type: String, default: "" },
  coverPicture: { type: [String], default: [] },
  age: { type: Number },
  phone: { type: String },
  gender: { type: Number, enum: GenderEnum, default: GenderEnum.Male},
  role: { type: Number, enum: RoleEnum, default: RoleEnum.User },
  changeCreditTime: { type: Date, default: Date.now },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;