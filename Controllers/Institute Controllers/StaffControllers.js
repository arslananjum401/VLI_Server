import db from "../../Conn/connection.js"
import { CheckUUID } from "../../Helpers/CheckUUID.js"

const { User, InstituteUser, Institute } = db
export const AddStaff = async (req, res) => {
    try {
        const CheckEmail = await User.findOne({ where: { Email: req.body.Email } })
        if (CheckEmail) {
            return res.status(403).json({ message: "Email already Taken" })
        }


        req.body.FromInstitute = req.User.Institute.InstituteId;
        req.body.UserName = req.body.FirstName + req.body.LastName + ((new Date().getTime() / 1000).toString().split('.')[1]);
        req.body.User = "Institute"
        req.body.Password = randomIntFromInterval()
        const CreateUser = await User.create(req.body)

        const addInstituteUser = await InstituteUser.create({
            InstituteUserType: "Staff",
            InstituteFK: req.User.Institute.InstituteId,
            Institute_UserFK: CreateUser.UserId
        })

        const GetCreatedUser = await User.findOne({
            where: { UserId: CreateUser.UserId },
            include: {
                model: InstituteUser, attributes: ["InstituteUserType"],
                include: { model: Institute }
            }
        })
        console.log(GetCreatedUser.dataValues)
        res.status(200).json(GetCreatedUser)
    } catch (error) {
        console.log(`Error Occurred while Creating staff member ${error.message}`)
        res.status(500).json(error)
    }
}
export const UpdateStaff = async (req, res) => {
    try {
        req.body.FromInstitute = req.User.Institute.InstituteId;
        req.body.UserName = req.body.FirstName + req.body.LastName;
        req.body.User = "Institute"
        req.body.Password = randomIntFromInterval()
        const CreateUser = await User.update(req.body)

        const UpdateInstituteUser = await InstituteUser.update({
            InstituteUserType: "Staff",
            InstituteFK: req.User.Institute.InstituteId,
            Institute_UserFK: UserInstructor.UserId
        })

        res.status(200).json(UpdateInstituteUser)
    } catch (error) {
        console.log(`Error Occurred while Updating staff member ${error.message}`)
        res.status(500).json(error)
    }
}



export const GetSingleStaffMemember = async (req, res) => {
    try {

        if (!CheckUUID(req.params.UserId))
            return res.status(404).json({ message: "Invalid UserId or not exist" })


        const GetCreatedUser = await User.findOne({
            where: { UserId: req.params.UserId },
            include: [{
                model: InstituteUser, attributes: ["InstituteUserType"],
                include: {
                    model: Institute,
                    where: { InstituteFK: req.User.Institute.InstituteId },
                }
            }]
        })
        res.status(200).json(GetCreatedUser)
    } catch (error) {
        console.log(`Error Occurred while getting staff member ${error.message}`)
        res.status(500).json(error)
    }
}






export const GetAllStaffMemembers = async (req, res) => {
    try {

        if (!CheckUUID(req.params.UserId))
            return res.status(404).json({ message: "Invalid UserId or not exist" })


        const GetCreatedUser = await User.findAll({

            include: [{
                model: InstituteUser, attributes: ["InstituteUserType"],
                include: {
                    model: Institute,
                    where: { InstituteFK: req.User.Institute.InstituteId },
                }
            }]
        })
        res.status(200).json(GetCreatedUser)
    } catch (error) {
        console.log(`Error Occurred while getting staff member ${error.message}`)
        res.status(500).json(error)
    }
}







export const DeleteStaffMemembers = async (req, res) => {
    try {

        if (!CheckUUID(req.params.UserId))
            return res.status(404).json({ message: "Invalid UserId or not exist" })

        const DeleteInstituteUser = await InstituteUser.destroy({
            where: {
                InstituteFK: req.User.Institute.InstituteId,
                UserId: req.params.UserId
            }
        })
        if (DeleteInstituteUser.length <= 0) {
            return res.status(401).json({ message: "User not found or has been deleted" })
        }
        const GetCreatedUser = await User.destroy({
            where: { UserId: req.params.UserId }
        })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.log(`Error Occurred while getting staff member ${error.message}`)
        res.status(500).json(error)
    }
}








function randomIntFromInterval() {
    const min = 10, max = 99;
    const DateD = new Date().getTime() / 1000
    const s = DateD.toString().split('.')[1]

    return Math.floor(Math.random() * (max - min + 1) + min) + s
}
