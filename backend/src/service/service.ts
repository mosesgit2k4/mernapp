import User from '../model/usermodel';
import bcrypt from 'bcrypt'
interface CreateUser{
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    password:string;
    phonenumber:string;
    image:string;
}
class UserService{
    async createUser (UserData:CreateUser){
        const user = await User.create(UserData)
        return user
    }
    async getusersByemail(email:string){
        try {
            return User.findOne({where:{email}})
        } catch (error) {
            console.log(error)
        }
    }
    async getUserByUsername(username: string) {
        try {
            return User.findOne({ where: { username } });
        } catch (error) {
            console.log(error)
        }
    }
    async getusers(){
        try {
            return  User.find()
        } catch (error) {
            console.log(error)
        }
    }
}

export const UserServices = new UserService()