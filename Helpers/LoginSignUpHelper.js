import { CheckInstituteUser } from '../Controllers/Common Controllers/CommonControllers.js';
import { GenerateToken } from '../Middlewares/GenerateToken.js';
import { CheckStudent } from './CheckStudent.js';

export const SendResponse = async (req, res, User, StudentInterest, status) => {
    const Token = await GenerateToken(User.UserId);
    const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite:true,
        // secure:true
    }
    User = await CheckInstituteUser(User.dataValues, User.dataValues.UserId);

    const Interest = await CheckStudent(StudentInterest, User);
    delete User.Password;

    return res
        .status(status)
        .cookie("token", Token, options)
        .cookie("checkToken", Token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) })
        .json({ User: User, Interest });
}