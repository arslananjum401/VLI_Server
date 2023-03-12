import express from "express";
import { LogOutUser, SearchCourse, GetInstituteList, GetAllCourses, ForgotPassword, ResetPassword, GetUserData, ChangePassword, GetPopularbooks, EditProfile, } from '../Controllers/Common Controllers/CommonControllers.js';
import { Login, SignUp, SignUpWithGoogle, LoginWithGoogle, VerifyEmail, SendEmailVerification, CheckResetPasswordToken, NewInstitute, SignUpWithFacebook, LoginWithFacebook, } from '../Controllers/Common Controllers/LogInSignUpControllers.js';
import { AuthenticatedUser } from "../Middlewares/Authentication/AuthenticateUser.js";
import { PasswordHash } from "../Middlewares/PasswordHashing.js";
import { MulterMiddleware } from "../Middlewares/Multer/MulterMiddleware.js";
import { DataParser } from "../Middlewares/ParseData.js";


const MulterForRegisteringInstitute = (req, res, next) => {
    let MulterVals = {};
    MulterVals.filepath = './Public/Institute/Documents'
    MulterVals.UploadFields = [{ name: 'LR_Slip' }, { name: "MOTR_Slip" }, { name: "InstituteLogo" }, { name: "Institute_Banner" }];
    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"
    MulterMiddleware(req, res, next, MulterVals)
}


const CRoutes = express.Router();
CRoutes.get('/search', SearchCourse)

CRoutes.get('/logout', LogOutUser)
CRoutes.get('/Institutelist', GetInstituteList)
CRoutes.get('/courses', GetAllCourses);

CRoutes.get('/me', AuthenticatedUser, GetUserData);

CRoutes.get('/verify-email', VerifyEmail);

CRoutes.post('/request/verify-email', AuthenticatedUser, SendEmailVerification);


CRoutes
    .post('/forgot/password', ForgotPassword)
    .get('/forgot/password/:resetToken', CheckResetPasswordToken)
    .put('/forgot/password/:resetToken', PasswordHash, ResetPassword)


CRoutes.post('/Institute/Register', MulterForRegisteringInstitute, DataParser, PasswordHash, NewInstitute);
 
CRoutes
    .post('/login', Login)
    .post('/login/Google', LoginWithGoogle)
    .post('/login/facebook', LoginWithFacebook)

CRoutes
    .post('/signup', PasswordHash, SignUp)
    .post('/signup/Google', SignUpWithGoogle)
    .post('/signup/facebook', SignUpWithFacebook)

CRoutes.post('/ChangePassword', AuthenticatedUser, PasswordHash, ChangePassword);
CRoutes.post('/Books/popular', GetPopularbooks);

CRoutes.post('/Edit/Profile', AuthenticatedUser, EditProfile)
export { CRoutes }