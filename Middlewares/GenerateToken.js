import Jwt from "jsonwebtoken";

export const GenerateToken = (UserID) => Jwt.sign(UserID, process.env.SECRETKEY);

