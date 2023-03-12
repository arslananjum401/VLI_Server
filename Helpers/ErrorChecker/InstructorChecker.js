import db from "../../Conn/connection.js"

const { Instructor, User } = db
export const CheckInstructorErrs = async (req) => {
    let Error = {}
    const CheckEmail = await User.findOne({
        where: { Email: req.body.Email }
    })
    const CheckLicenseNumber = await Instructor.findOne({
        where: { LicenseNumber: req.body.LicenseNumber },
    })
    const CheckSpecialLicenseNumber = await Instructor.findOne({
        where: { LicenseNumber: req.body.LicenseNumber },
    })


    if (CheckLicenseNumber)
        Error.LicenseNumber = "Invalid License Number";
    if (CheckEmail)
        Error.Email = "Email already in use ";
    if (CheckSpecialLicenseNumber)
        Error.SpecialLicenseNumber = "Invalid Special License Number";

    return Error

}