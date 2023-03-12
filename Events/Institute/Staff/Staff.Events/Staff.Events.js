import db from "../../../../Conn/connection.js"
import { FindUserId } from "../../../Helpers/SaveUser.js"
const { VehicleTypes, Course, SubLicenseTypes, LicenseTypes } = db
export const GetVehicleTypes = async (Props, StafftArr, socket, io) => {
    try {
        const GotVehicleTypes = await VehicleTypes.findAll()
        socket.emit("GetVehicleTypes")

    } catch (error) {

    }
}

const checkval = (order, Key, VALUE) => {
    let Check = false
    order.forEach((value, index) => {
        if (value[0] === Key) {
            Check = index
        }
    })
    if (!Check)
        return order.push([Key, VALUE])
    else if (Check)
        order[Check][1] = VALUE
}
export const GetFilteredCourses = async (Props, StafftArr, socket, io) => {



    let order = [];
    let where = {}
    // const User = FindUserId(StafftArr, socket.id);
    try {
        if (Props.BookType)
            where = { where: { CourseName: Props.CourseName } }

        if (Props.VehicleTypeFK)
            where = {
                where: { ...where.where, VehicleTypeFK: Props.VehicleTypeFK }
            }



        if (Props.LicenseTypeFK)
            where = {
                where: { ...where.where, LicenseTypeFK: Props.LicenseTypeFK }
            }


        if (Props.createdAt?.toLocaleLowerCase() === "new to old")
            checkval(order, "createdAt", "asc")
        else if (Props.createdAt?.toLocaleLowerCase() === "old to new")
            checkval(order, "createdAt", "desc")



        if (Props.CourseName?.toLocaleLowerCase() === "A to Z"?.toLocaleLowerCase())
            checkval(order, "CourseName", "asc")
        else if (Props.CourseName?.toLocaleLowerCase() === "Z to A"?.toLocaleLowerCase())
            checkval(order, "CourseName", "desc")


        const GetCourses = await Course.findAll({
            ...where,
            order: [...order],
            attributes: { exclude: ["VehicleTypeFK", "LicenseTypeFK", "SubLicenseTypeFK"] },
            // ...Paginate({ Page: 0, PageSize: 10 }),
            include: [
                { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true, },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, },
            ]
        })
        console.log(GetCourses)
        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredAdminCourses", GetCourses);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}