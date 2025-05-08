import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    hashedPassword: string;
    accessToken?: string;
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    backupCodes: string[];
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        hashedPassword: {
            type: String,
            required: true,
            minlength: 8,
        },
        accessToken: {
            type: String,
            default: null,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        twoFactorSecret: {
            type: String,
            default: null,
        },
        backupCodes: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('hashedPassword') || this.isNew) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(12);
        this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
    }
    next();
});

UserSchema.index({ email: 1, username: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
