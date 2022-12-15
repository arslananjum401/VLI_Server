import Jwt from "jsonwebtoken";

export const GenerateToken = async (UserID) => {

   const Token = await Jwt.sign(UserID, process.env.SECRETKEY);
   return Token;
}