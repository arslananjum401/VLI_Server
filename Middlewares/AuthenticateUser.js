import JWT from 'jsonwebtoken';
import { Op } from 'sequelize';
import db from '../Conn/connection.js';
import { CheckInstituteUser } from '../Controllers/Common Controllers/CommonControllers.js';
const { Institute, InstituteUser, User: UserModel, UserEmailValidation } = db;
export const AuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = await req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Pleases login first" })
        }

        const decoded = JWT.verify(token, process.env.SecretKey);

        if (!decoded) {
            return res.status(401).json({ message: "Pleases login again" });
        }

        const User = await UserModel.findOne({

            attributes: {
                exclude: ['Password']
            },
            where: {
                UserId: decoded
            },
            include: [{ model: UserEmailValidation, attributes: ["IsVerified"] },
            { model: InstituteUser }
            ]

        })

        if (!User) {
            return res.status(401).clearCookie('token').clearCookie('checkToken').json({ message: "Please login first" }).end();
        }

        req.UserId = decoded
        req.User = User.dataValues;
        req.User = await CheckInstituteUser(req.User, req.UserId)
        next()

    } catch (error) {
        console.log(`error occurred while Authenticating user ${error.message}`);
        return res.status(500).json({ message: error });
    }
}

export const AuthenticateUserType = async (req, res, next, UserType, InstituteUserType) => {
    if (req.User.User !== UserType) 
        return res.status(401).json({ message: "Unauthorized Access" });
    
    if (req.User.User === "Institute" && req.User.InstituteUserType !== InstituteUserType)
        return res.status(401).json({ message: "Unauthorized Institute User" });

    next()
}
