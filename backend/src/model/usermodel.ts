import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
    _id: ObjectId
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image: string;
    phonenumber: number;
    username: string;
    addressId: Schema.Types.ObjectId;
    isadmin: string;
    comparePassword: (password: string) => Promise<boolean>;
}

// Define the schema
const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
    },
    isadmin: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});


userSchema.pre("save", async function (next) {
    const user = this as IUser;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next();
    }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export {IUser, User};
