import db from "../../../Conn/connection.js";
import { FindUserId } from "../../Helpers/SaveUser.js";
import { IncludeQuery } from "./Includes.js";

const { LicenseTypes, SubLicenseTypes, WishList, Course, InstituteCourses, CoursePackages } = db;

export const SortCourses = async (Props, Arr, socket, io) => {
    const User = FindUserId(Arr, socket.id);
    if (Props.FilterValue === "High_Price")
        IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "DESC"]

    else if (Props.FilterValue === "Low_price")
        IncludeQuery.order[0] = [Course, InstituteCourses, CoursePackages, "TotalFee", "ASC"]

    else if (Props.FilterValue === "Most_Recent")
        IncludeQuery.order[0] = [Course, InstituteCourses, "createdAt", "DESC"]

    else if (Props.FilterValue === "Most_Relevant")
        IncludeQuery.order[0] = undefined;


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
        console.log(`Error occurrred while sorting courses: ${err}`)
    }
}