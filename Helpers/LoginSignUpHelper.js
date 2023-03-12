import { CheckInstituteUser } from '../Controllers/Common Controllers/CommonControllers.js';
import { GenerateToken } from '../Middlewares/GenerateToken.js';
import { CheckStudent } from './CheckStudent.js';
import db from '../Conn/connection.js';
import { Paginate } from './Paginate.js';
const { Notification } = db
export const SendResponse = async (res, User, status) => {
    const Token = GenerateToken(User.UserId);
    const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // sameSite: true,
        // secure: true
    }

    User = await CheckInstituteUser(User.dataValues, User.dataValues.UserId);
    const GetNotifications = await Notification.findAll({
        where: {
            ToUserId: User.UserId
        },
        ...Paginate({ Page: 1, PageSize: 5 })
    }) 

    delete User.Password;

    return res
        .status(status)
        .cookie("token", Token, options)
        .json({ User, Notifications: GetNotifications });
}