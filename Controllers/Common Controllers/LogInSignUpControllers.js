import { Op } from 'sequelize';
import db from '../../Conn/connection.js';
import crypto from 'crypto';
import { getVerifyEmailToken, sendEmail } from '../../Middlewares/ResetPassword.js';
import { ComparePassword } from '../../Middlewares/PasswordVerification.js';

import { SendEmailToVerify } from '../../Helpers/SendEmailToVerify.js'
import { SendResponse } from '../../Helpers/LoginSignUpHelper.js';
import NodeFetch from 'node-fetch';
import { InsCheckErrorHelper, SignupErrorHelper } from '../../Helpers/LoginSignupError.js';
import fetch from 'node-fetch';


const { Institute, User: UserModel, StudentInterest, UserEmailValidation, UserResetPassword, InstituteUser } = db;


export const Login = async (req, res) => {
    try {

        if (!req.body.Email && !req.body.UserName) {
            return res.status(401).json({ message: "Email or UserName is required" });
        }
        const RecaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
        fetch(`https://api.ipbase.com/v2/info?apikey=tX7OdfTrckVcojlTPli1j75vJUSRdKNwlhsxiAyP&ip=${req.body.IpAddress}`)
            .then(async (res) => await res.json())
        // .then((data) => {console.log( data.data.location.country.name) })
        let LoginUser;
        if (req.body.UserName) {
            LoginUser = await UserModel.findOne({
                where: { UserName: req.body.UserName },
                include: [{ model: UserEmailValidation, attributes: ["IsVerified"] }]
            });
        } else {
            LoginUser = await UserModel.findOne({
                where: { Email: req.body.Email },
                include: [{ model: UserEmailValidation, attributes: ["IsVerified"] }]
            });
        }



        if (!LoginUser) {
            return res.status(401).json({ message: "Email or password incorrect" });
        }


        if (process.env.NODE_ENV === 'Production') {
            let CaptchaResponse;
            await NodeFetch(RecaptchaURL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${process.env.GOOGLE_CAPTCHA_KEY_FOR_SERVER}&response=${req.body.Token}`

            })
                .then((response) => response.json())
                .then((response) => { CaptchaResponse = response });
            console.log(CaptchaResponse);
            if (!CaptchaResponse?.success || CaptchaResponse.score < 0.8) {
                return res.status(401).json({ message: "You are not a human" });
            }

        }
        let CheckPassword
        if (typeof (Number(LoginUser.Password)) === "number" && req.body.Password == LoginUser.Password) {
            CheckPassword = true;
        }
        else {

            CheckPassword = await ComparePassword(req.body.Password, LoginUser.Password);
        }
        if (!CheckPassword) {

            return res.status(401).json({ message: "Email or password incorrect" });
        }

        return await SendResponse(req, res, LoginUser, StudentInterest, 200);
    } catch (error) {
        console.log(`error occurred while Logging in: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}



export const SignUp = async (req, res) => {
    if (!req.body.UserName) 
        req.body.UserName = req.body.FirstName + req.body.LastName
    
    if (!req.body.User) 
        req.body.User = "Student"
    
    try {
        let ErrorCheck = {};
        ErrorCheck.EmailErr = await UserModel.findOne({
            where: {
                Email: req.body.Email 
            }
        });
        ErrorCheck.UserNameErr = await UserModel.findOne({
            where: {
                UserName: req.body.UserName
            }
        });
        if (SignupErrorHelper(ErrorCheck, res)) {
            return
        }

        const CreatedUser = await UserModel.create(req.body);

        SendEmailToVerify(CreatedUser, UserEmailValidation, req);
        return await SendResponse(req, res, CreatedUser, StudentInterest, 201);


    } catch (error) {
        console.log(`error occurred while Signing up student: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const LoginWithFacebook = async (req, res) => {
    try {
        const { accessToken, userID, id } = req.body;
        let UserData
        let graphUrl = `https://graph.facebook.com/v2.11/${userID}/?fields=id,first_name,last_name,middle_name,name_format,name,picture,email&access_token=${accessToken}`

        await NodeFetch(graphUrl, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((response) => {
                UserData = {
                    Email: response.email,
                    UserName: response.first_name + response.last_name,
                    User: "Student"
                }
            });


        if (UserData.Email === undefined) {
            UserData.Email = ''
        }
        if (UserData.UserName === undefined) {
            UserData.UserName = ''
        }
        const FoundUserData = await UserModel.findOne({
            where: {
                [Op.or]: {
                    Email: UserData.Email,
                    UserName: UserData.UserName
                },

                User: UserData.User,

            }
        });
        if (!FoundUserData) {
            const UserCreated = await UserModel.create(UserData);
            return await SendResponse(req, res, UserCreated, StudentInterest, 200);
        }
        return await SendResponse(req, res, FoundUserData, StudentInterest, 200);

    } catch (error) {
        console.log(`error occured while logging in with facebook ${error}`);
        return res.status(500).json(error);
    }
}
export const SignUpWithFacebook = async (req, res) => {
    try {
        const { accessToken, userID, id } = req.body;
        let UserData
        let graphUrl = `https://graph.facebook.com/v2.11/${userID}/?fields=id,first_name,last_name,middle_name,name_format,name,picture,email&access_token=${accessToken}`
        await NodeFetch(graphUrl, {
            method: "GET"
        })
            .then((response) => response.json())
            .then((response) => {
                UserData = {
                    Email: response.email,
                    UserName: response.first_name + response.last_name,
                    User: "Student",
                    IsVerified: true,
                }
            });


        if (UserData.Email === undefined) {
            UserData.Email = ''
        }
        if (UserData.UserName === undefined) {
            UserData.UserName = ''
        }
        let FoundUserData = await UserModel.findOne({
            where: {
                Email: UserData.Email,
                UserName: UserData.UserName,
                User: UserData.User,
            }
        });
        // if (!FoundUserData) {
        //     FoundUserData = await UserModel.findOne({
        //         where: {
        //             [Op.or]: {
        //                 Email: UserData.Email,
        //                 UserName: UserData.UserName
        //             },
        //             User: UserData.User,
        //         }
        //     });
        // }

        if (FoundUserData) {

            return await SendResponse(req, res, FoundUserData, StudentInterest, 200);
        }

        const UserCreated = await UserModel.create(UserData);

        return await SendResponse(req, res, UserCreated, StudentInterest, 201);

    } catch (error) {
        console.log(`error occured while Signning up with facebook ${error}`);
        return res.status(500).json(error);
    }
}


export const SignUpWithGoogle = async (req, res) => {
    try {

        const CheckUser = await UserModel.findOne({
            where: { Email: req.body.email }
        })
        if (CheckUser) {

            return await SendResponse(req, res, CheckUser, StudentInterest, 200);

        }
        let CreateUser = await UserModel.create({
            Email: req.body.email,
            UserName: req.body.family_name + req.body.given_name,
            IsVerified: true,
            User: "Student"
        })

        await SendResponse(req, res, CreateUser, StudentInterest, 201)
    } catch (error) {
        console.log(`error occured while Signning in with google ${error}`);
        return res.status(500).json(error);
    }
}


export const LoginWithGoogle = async (req, res) => {
    try {
        let CheckUser = await UserModel.findOne({
            where: { Email: req.body.email },
            attributes: { exclude: ['Password'] },

        });

        if (!CheckUser) {
            return res.status(404).json({ message: "User not found. Please Signup" })
        }

        return await SendResponse(req, res, CheckUser, StudentInterest, 200)

    } catch (error) {
        console.log(`error occured while logging in with google ${error}`);
        return res.status(500).json(error);
    }
}




export const VerifyEmail = async (req, res) => {
    let ChString = crypto.createHash('sha256').update(req.query.token).digest('hex');
    try {

        const FoundUser = await UserModel.findOne({
            where: {
                EmailToken: ChString
            }
        })

        if (!FoundUser) {
            console.log("FoundUser")
            return res.status(200).redirect('http://localhost:3000/')
        }

        FoundUser.EmailToken = '';
        FoundUser.IsVerified = true;
        await FoundUser.save();
        let options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }


        res.status(200)
            // .json(FoundUser)
            .redirect('http://localhost:3000/login')
        // .cookie("token", Token, options)
        // .cookie("checkToken", Token, { ...options, httpOnly: false })
    } catch (error) {
        console.log(`error occured while verifying email ${error}`);
        return res.status(500).json(error);
    }
}


export const SendEmailVerification = async (req, res) => {
    try {
        let Token = await getVerifyEmailToken({ UserId: req.UserId }, User);

        const Link = `http://${req.headers.host}/common/verify-email?token=${Token}`
        const options = {
            email: req.body.Email,
            subject: `Vehicle Learning School-Please verify your email`,
            text: `Thanks for Signing up. Please open the link given below to verify your account.
           ${Link}`,
            html: `<h2>Thanks for signing up</h2
            <p> Please click the link to verify your account</p>
            <a href="${Link}">Verify Your Email</a>
            `
        }

        await sendEmail(options)
        res.status(200).json({ message: "Please check your inbox for Email." })
    } catch (error) {
        console.log(`error occured while sending 'again Verify email' ${error}`);
        return res.status(500).json(error);
    }
}




export const CheckResetPasswordToken = async (req, res) => {
    try {

        let ChString = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const FoundUser = await UserModel.findOne({
            include: [{
                model: UserResetPassword, required: true,
                where: {
                    ResetPasswordToken: ChString,
                    ResetPasswordExpire: {
                        [Op.gt]: new Date(Date.now())
                    }
                }
            }],

        })



        if (!FoundUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid Token or expired"
            })
        }

        const message = { message: "Allow User", success: true }

        res.status(200).json(message)

    } catch (error) {
        console.log(`error occured while resetting password ${error}`);
        return res.status(500).json(error);
    }
}

export const NewInstitute = async (req, res) => {

    req.body.User = "Institute";
    try {
        let CheckError = {}
        CheckError.InsNameErr = await Institute.findOne({
            where: { InstituteName: req.body.UserName }
        });
        CheckError.EmailErr = await UserModel.findOne({
            where: { Email: req.body.Email }
        })
        CheckError.UserNameErr = await UserModel.findOne({
            where: { UserName: req.body.UserName }
        })
        const RegistrationError = InsCheckErrorHelper(CheckError, res)
        if (RegistrationError) {
            return
        }


        const newInstituteUser = await UserModel.create(req.body)

        req.body.InstituteUserId = newInstituteUser.UserId;
        await SendEmailToVerify(newInstituteUser, UserEmailValidation, req);


        let newInstitute = await Institute.create(req.body)

        await InstituteUser.create({ InstituteFK: newInstitute.InstituteId, Institute_UserFK: newInstituteUser.UserId, InstituteUserType: "Admin" })

        newInstitute = { ...newInstituteUser.dataValues, Institute: newInstitute };
        delete newInstitute.Password
        return res.status(201).json(newInstitute)
    } catch (errors) {
        console.log(`error occured while creating newInstitute ${errors}`);
        return res.status(500).json({ messsage: errors });
    }

}
