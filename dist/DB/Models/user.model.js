import { Schema, model, connect } from "mongoose";
import { ProviderEnum, GenderEnum, RoleEnum } from "../../enums/user.enums.js";
const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return this.provider === ProviderEnum.System;
        },
    },
    provider: { type: Number, enum: ProviderEnum, default: ProviderEnum.System },
    confirmEmail: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: [String], default: [] },
    age: { type: Number },
    phone: { type: String },
    gender: { type: Number, enum: GenderEnum, default: GenderEnum.Male },
    role: { type: Number, enum: RoleEnum, default: RoleEnum.User },
    changeCreditTime: { type: Date, default: Date.now },
});
const UserModel = model("User", userSchema);
export default UserModel;
