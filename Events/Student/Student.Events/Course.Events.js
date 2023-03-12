import db from "../../../Conn/connection.js";
import { FindUserId } from "../../Helpers/SaveUser.js";

const { LicenseTypes, SubLicenseTypes, WishList, Course, InstituteCourses, CoursePackages, Institute,VehicleTypes } = db;
const IncludeQuery = {
    include: {
        model: Course,
        attributes: ["CourseName", "Description", "CourseThumbnail"],
        include: {
            model: InstituteCourses,
            attributes: ["InstituteCourseId", "ShortDescription"],
            include: [
                { model: CoursePackages, attributes: ["CoursePackageId", "TotalFee", "InstallmentSchedule"] },

                { model: Institute, attributes: ["InstituteName", "InstituteId", "Country", "State", "City"] },

            ]
        }
    },
    order: []
}

export const SortLicenseCourses = async (Props, Arr, socket, io) => {

    if (Props.FilterValue === "Most_Relevant")
        delete IncludeQuery.order
    else {
        if (!IncludeQuery.order) {
            IncludeQuery.order = []
        }
        if (Props.FilterValue === "High_Price")
            IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "DESC"]

        else if (Props.FilterValue === "Low_price")
            IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "ASC"]

        else if (Props.FilterValue === "Most_Recent")
            IncludeQuery.order[0] = [Course, InstituteCourses, "createdAt", "DESC"]
    }

    const User = FindUserId(Arr, socket.id);
    try {

        const GetLicenseTypes = await LicenseTypes.findOne({
            where: {
                Active: true,
                LicenseTypeId: Props.LicenseTypeId
            },
            include: {
                model: SubLicenseTypes,
            }
        });

        if (User?.Authenticated) {
            let Wish = {
                model: WishList, attributes: ["WishId", "StudentId"],
                where: { StudentId: User.UserId },
                required: false
            }
            IncludeQuery?.include?.include?.include.push(Wish)
        }

        let Obj = {};
        if (GetLicenseTypes.SubLicenseTypes.length > 0) {
            Obj = {
                include: {
                    model: SubLicenseTypes
                }
            }
            Object.assign(IncludeQuery, Obj)
        } else
            Obj = IncludeQuery;




        let AllCatgories = await LicenseTypes.findOne({
            where: {
                Active: true,
                LicenseTypeId: Props.LicenseTypeId
            },
            attributes: { exclude: ["Active", "SubLicenseType"] },
            ...Obj
        });

        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("ReceiveSortedCourse", AllCatgories);
    }
    catch (err) {
        console.log(`Error occurrred while sorting license courses: ${err}`)
    }
}

export const SortVehicleCourses = async (Props, Arr, socket, io) => {

    if (Props.FilterValue === "Most_Relevant")
        delete IncludeQuery.order
    else {
        if (!IncludeQuery.order) {
            IncludeQuery.order = []
        }
        if (Props.FilterValue === "High_Price")
            IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "DESC"]

        else if (Props.FilterValue === "Low_price")
            IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "ASC"]

        else if (Props.FilterValue === "Most_Recent")
            IncludeQuery.order[0] = [Course, InstituteCourses, "createdAt", "DESC"]
    }

    const User = FindUserId(Arr, socket.id);


    try {

        if (User.UserId) {
            let Wish = {
                model: WishList, attributes: ["WishId", "StudentId"],
                where: { StudentId: User.UserId },
                required: false
            };
            IncludeQuery?.include?.include?.include.push(Wish);
        }



        const AllCatgories = await VehicleTypes.findOne({
            where: {
                Active: true,
                VehicleTypeId: Props.VehicleTypeId
            },
            attributes: { exclude: ["Active", "SubLicenseType"] },
            ...IncludeQuery
        });
        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("ReceiveSortedCourse", AllCatgories);
    }
    catch (err) {
        console.log(`Error occurrred while sorting vehicle courses: ${err}`)
    }
}