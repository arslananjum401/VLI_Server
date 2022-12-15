import nodemailer from 'nodemailer';
import crypto from 'crypto';
const { randomUUID } = crypto
export const sendEmail = async (options) => {
    const transpoter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secureConnection: false,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }
    transpoter.sendMail(
        mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ', info.response);
        }
    )
}

export const getResetPasswordToken = async ({ UserId }, UserResetPasswordModel) => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    let ResetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    let ResetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    const done = await UserResetPasswordModel.create({
        UserResetPasswordId: randomUUID(),
        UserFK: UserId,
        ResetPasswordToken,
        ResetPasswordExpire
    })
    return resetToken;
}


export const getVerifyEmailToken = async ({ UserId }, UserEmailValidation) => {
    try {
        const resetToken = crypto.randomBytes(20).toString('hex');

        let EmailToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  
        const a = await UserEmailValidation.create({
            UserFK: UserId,
            EmailToken
        })

        return resetToken;
    } catch (error) {
        console.log(`error occurred while creating EmailToken: ${error}`)
    }
}