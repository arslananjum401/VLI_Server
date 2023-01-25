import { getVerifyEmailToken, sendEmail } from "../Middlewares/ResetPassword.js";
import fs from 'fs';
import handlebars from 'handlebars';
export const SendEmailToVerify = async (NewUserInfo, UserEmailValidation, req) => {
    let Token = await getVerifyEmailToken(NewUserInfo, UserEmailValidation);

    const Link = `http://${req.headers.host}/common/verify-email?token=${Token}`
    const options = {
        email: NewUserInfo.Email,
        subject: `Vehicle Learning School-Please verify your email`,
        text: `Thanks for Signing up. Please open the link given below to verify your account.
           ${Link}
            `,
        html: `<h2>Thanks for signing up</h2
            <p> Please click the link to verify your account</p>
            <a href="${Link}">Verify Your Email</a>
            `
    }

    await sendEmail(options);
}
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;

        }
        else {
            callback(null, html);
        }
    });
};

export const SendReceipt = async (UserInfo, req, replacements, InstituteEmail) => {

    readHTMLFile('../Receipt.html', async (err, html) => {
        const template = handlebars.compile(html);

        const HtmlToSend = template(replacements);
        console.log(HtmlToSend);
        const options = {
            email: [UserInfo.Email, "arslananjum1515@gmail.com"],
            subject: "Transaction Receipt",
            message: "",
            html: HtmlToSend
        }
        await sendEmail(options)
    })
}