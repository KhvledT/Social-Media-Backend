import { Schema, model, type HydratedDocument } from "mongoose";
import { ProviderEnum, GenderEnum, RoleEnum } from "../../enums/user.enums.js";
import { hashOperation } from "../../Common/security/hash.js";
import { encrptValue } from "../../Common/security/encrypt.js";
import MailService from "../../Common/Email/email.service.js";
import { EmailTypeEnum } from "../../enums/email.enum.js";

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
  deletedAt: Date | null;
}

export type IHUser = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (): boolean {
        return this.provider === ProviderEnum.System;
      },
    },
    provider: {
      type: Number,
      enum: ProviderEnum,
      default: ProviderEnum.System,
    },
    confirmEmail: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: [String], default: [] },
    age: { type: Number },
    phone: { type: String },
    gender: { type: Number, enum: GenderEnum, default: GenderEnum.Male },
    role: { type: Number, enum: RoleEnum, default: RoleEnum.User },
    changeCreditTime: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, strictQuery: true },
);

userSchema.pre("save", async function (this: IHUser & { wasNew: boolean }) {
  this.wasNew = this.isNew;
  if (this.isModified("password")) {
    this.password = await hashOperation({ plainText: this.password });
  }

  if (this.phone && this.isModified("phone")) {
    this.phone = encrptValue({ value: this.phone });
  }
});

userSchema.pre("save", async function (this: IHUser & { wasNew: boolean }) {
  try {
    if (this.wasNew) {
      await MailService.sendEmailOtp({
        email: this.email,
        emailType: EmailTypeEnum.confirmEmail,
        subject: "Confirm Your Email",
      });
    }
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
});

userSchema.pre(["findOne", "find"], function () {
  const query = this.getQuery();
  if (query?.paranoid == true){
    this.setQuery({ ...query, deletedAt: { $exists: false } });
  }
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
