import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    fullname: string;
    hashedPassword: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    backupCodes: string[];
    twoFactorRequestStatus: 'none' | 'pending' | 'approved';
    role: 'user' | 'admin';
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
        fullname: {
            type: String,
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
        twoFactorRequestStatus: { type: String, enum: ['none', 'pending', 'approved'], default: 'none' },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
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

UserSchema.index({ email: 1, fullname: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
