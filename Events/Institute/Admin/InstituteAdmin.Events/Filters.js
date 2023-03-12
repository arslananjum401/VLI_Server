import db from "../../../../Conn/connection.js"
import { FindUserId } from "../../../Helpers/SaveUser.js"

const { Vehicle, InstituteCourses, User, InstituteUser, Institute, VehicleImages } = db
export const GetInsAdminFilteredCourses = async (Props, StafftArr, socket, io) => {
    let where = {}
    // const User = FindUserId(StafftArr, socket.id);
    try {
        if (Props.Course === "All Courses")
            delete where.where

        if (Props.Course === "To be reviewed")
            where = {
                where: { ...where.where, Publish: { [Op.or]: ["Pending", "false"] } }
            }

        if (Props.Course === "Approved")
            where = {
                where: { ...where.where, Publish: "Approved" }
            }

        if (Props.Course === "Rejected")
            where = {
                where: { ...where.where, Publish: "Rejected" }
            }



        const GetCourses = await InstituteCourses.findAll({
            ...where,
            // ...Paginate({ Page: 0, PageSize: 10 }),
            include: [
                { model: Course },

            ]
        })

        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredInsAdminCourses", GetCourses);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}


export const GetInsFilteredVehicles = async (Props, UsersArr, socket, io) => {
    let where = {};
    let order = []
    const SocketUser = FindUserId(UsersArr, socket.id);


    try {
        const GetInstitute = await User.findOne({
            where: {
                UserId: SocketUser.UserId,

            }, 
            include: {
                model: InstituteUser,
                include: {
                    model: Institute
                }
            }
        })

        if (Props.VehicelTypeFK)
            where = { ...where, VehicelTypeFK: Props.VehicelTypeFK }


        if (Props.LicenseTypeFK)
            where = { ...where, LicenseTypeFK: Props.LicenseTypeFK }

        if (Props.Date === "New to Old")
            order.push(["createdAt", "desc"])
        else if (Props.Date === "Old to New")
            order.push(["createdAt", "asc"])

        if (Props.Model === "A to Z")
            order.push(["Model", "asc"])
        else if (Props.Model === "Z to A")
            order.push(["Model", "desc"])



        const GetAllVehicles = await Vehicle.findAll({
            where: { InstituteFK: GetInstitute?.InstituteUser?.Institute?.InstituteId, },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink", "Vehicle_ImageId"],
            }],
            order: [...order]
        })
        console.log(GetAllVehicles)
        // // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredInsVehicles", GetAllVehicles);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}