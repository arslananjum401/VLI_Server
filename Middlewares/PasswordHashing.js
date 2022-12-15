import bcrypt from 'bcrypt';


export const PasswordHash = async (req, res, next) => {

    try {

        let HashPassword = await bcrypt.hash(req.body.Password, 10);
        req.body.Password = HashPassword;
       
        next()
    } catch (error) {
        console.log(`Error occurred while hashing password: ${error.message}`);
    }
}