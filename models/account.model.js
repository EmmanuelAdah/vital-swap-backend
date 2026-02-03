import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
        index: true,
        set: number => number.replace(/[^A-Z0-9]/gi, '').toUpperCase(),
        validate: {
            validator: (number) => /^[A-Z0-9]{8,30}$/.test(number),
            message: 'Invalid account number format'
        }
    },
    accountHolder: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    bankCode: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['NGN', 'USD', 'GBP', 'EUR'],
        default: 'NGN'
    },
    settlementType: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isLocal: {
        type: Boolean,
        default: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

accountSchema.index(
    { isPrimary: 1 },
    { unique: true, partialFilterExpression: { isPrimary: true } }
);

accountSchema.pre('save', async function(next) {
    if (this.isPrimary) {
        await this.constructor.updateMany(
            { _id: { $ne: this._id } },
            { $set: { isPrimary: false } }
        );
    }
    next();
});

accountSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update && update.isPrimary) {
        await this.model.updateMany(
            {_id: {$ne: this.getQuery()._id}},
            {$set: {isPrimary: false}}
        );
    }
    next();
});
accountSchema.index(
    {accountNumber: 1, bankCode: 1},
    {unique: true});

module.exports = mongoose.model('Account', accountSchema);