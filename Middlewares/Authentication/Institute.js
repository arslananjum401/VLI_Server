import { AuthenticateUserType } from "./AuthenticateUser.js";

export const AuthenticateInstituteAdminUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Institute", ["Admin", "Staff"]);
}
export const AuthenticateInstituteStaffUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Institute", ["Admin", "Staff"]);
}
export const AuthenticateInstituteInstructorUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Institute", ["Admin", "Instructor", "Staff"]);
}