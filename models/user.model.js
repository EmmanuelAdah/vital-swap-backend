import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        set: name => name.toUpperCase(),
        required: [true, 'First name is required'],
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        set: name => name.toUpperCase(),
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
        uppercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false,
    },
    imageUrl: {
        type: String,
        required: false
    },
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }]
}, { timestamps: true });

    userSchema.pre('save', async function() {
        if (!this.isModified('password')) return;

        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    });

    userSchema.methods.matchPassword = async function(enteredPassword) {
        return bcrypt.compare(enteredPassword, this.password);
    };


export default mongoose.model('User', userSchema);