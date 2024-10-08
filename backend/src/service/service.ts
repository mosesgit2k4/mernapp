import User, { IUser } from '../model/usermodel';
import bcrypt from 'bcrypt';
import Address from "../model/addressModel";
import Plan from "../model/planModel";
import { ObjectId } from 'mongoose';

interface CreateUsers {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phonenumber: number;
    image: string;
    isadmin: string;
}
interface CreatePlan {
    name: string;
    start: Date;
    end: Date;
    image: string;
    description: string;
}
interface CreateAddress {
    country: string;
    state: string;
    city: string;
    addresses: string;
    zipcode: number;
    type: string;
}

class UserService {
    // Create a new user and address
    async createUser(userData: CreateUsers, addressData: CreateAddress) {
        try {
            const address = await Address.create(addressData);
            const user = await User.create({ ...userData, addressId: address._id });
            return user;
        } catch (err) {
            console.log(err);
            return { message: "There was an error creating the user" };
        }
    }

    // Get user by ID
    async getusersByid(id: string) {
        try {
            const user = await User.findById(id).lean();
            if (!user) {
                return 'User not found';
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.log(error);
            return 'Error occurred';
        }
    }

    // Get user by email
    async getusersByemail(email: string) {
        try {
            return await User.findOne({ email }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Get user by username
    async getUserByUsername(username: string) {
        try {
            return await User.findOne({ username }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Get user by phone number
    async getUsersByphone(mobilephone: number) {
        try {
            return await User.findOne({ mobilephone }).lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Update user password
    async updatepassword(email: string, newpassword: string, confirmpassword: string) {
        if (newpassword !== confirmpassword) {
            return "Passwords do not match";
        }
        try {
            const hashedPassword = await bcrypt.hash(newpassword, 10);

            const updateResult = await User.updateOne(
                { email },
                { $set: { password: hashedPassword } }
            );

            if (updateResult.modifiedCount === 0) {
                return null;
            }

            return true;
        } catch (error) {
            console.log(error);
            return 'Error occurred while updating password';
        }
    }


    // Update user details
    async updateuser(id: string, newfirstName: string, newlastName: string, newemail: string, newusername: string, newmobilephone: number, newimage: string) {
        try {
            const update = await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        firstName: newfirstName,
                        lastName: newlastName,
                        email: newemail,
                        username: newusername,
                        phonenumber: newmobilephone,
                        image: newimage
                    }
                },
                { new: true }
            );

            if (!update) {
                return null;
            }
            return update;
        } catch (error) {
            console.log(error);
        }
    }

    // Create a new plan
    async createplans(plansData: CreatePlan) {
        try {
            const plan = await Plan.create(plansData);
            return plan;
        } catch (error) {
            console.log(error);
            return { message: "There was an error creating the plan" };
        }
    }

    // Get all plans
    async getplans() {
        try {
            const plans = await Plan.find().lean();
            if (!plans) {
                return 'No plans found';
            }
            return plans;
        } catch (error) {
            console.log("Error:", error);
        }
    }
    //Get plan by id
    async getplanbyid(id: number) {
        try {
            const plan = Plan.findById(id).lean()
            if (!plan) {
                return
            }
            return plan
        } catch (error) {

        }
    }
}

export const UserServices = new UserService();
