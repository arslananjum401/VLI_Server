import { Op } from "sequelize";
import { InstituteStaff } from "../../../../app.js";
import db from "../../../../Conn/connection.js";
import { Paginate } from "../../../../Helpers/Paginate.js";
import { FindUserId, GetSocketId } from "../../../Helpers/SaveUser.js";
import { StafftArr } from "../../Staff/Staff.js";


const { InstituteCourses, Course, InstituteUser, Institute, User, ForwardedCourse, Notification } = db

export const RejectNewCourse = async (Props, StafftArr, socket, io) => {
    let where = {}
    // const User = FindUserId(StafftArr, socket.id);
    try {




        const GetCourses = await InstituteCourses.update({
            PublishResponse: Props?.PublishResponse,
            Publish: "Rejected"
        }, {
            where: { InstituteCourseId: Props?.InstituteCourseId }
        })
        const InstituteCourse = await InstituteCourses.findAll({
            where: { InstituteFK: Props.InstituteId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: { model: Course, attributes: ["CoursePK", "Description", "CourseName"] },

        })

        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredInsAdminCourses", InstituteCourse);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}
export const ApproveNewCourse = async (Props, StafftArr, socket, io) => {
    let where = {}
    // const User = FindUserId(StafftArr, socket.id);
    try {




        const GetCourses = await InstituteCourses.update({
            Publish: "Approved"
        }, {
            where: { InstituteCourseId: Props?.InstituteCourseId }
        })
        console.log(GetCourses)
        const InstituteCourse = await InstituteCourses.findAll({
            where: { InstituteFK: Props.InstituteId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: { model: Course, attributes: ["CoursePK", "Description", "CourseName"] },

        })

        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredInsAdminCourses", InstituteCourse);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}


export const RecommendCourse = async (Props, socket, Arr, io) => {
    try {

        const SocketUser = FindUserId(Arr, socket.id);


        const GetInsId = await Institute.findOne({
            include: {
                model: InstituteUser,
                where: {
                    InstituteUserType: "Admin"
                },
                include: {
                    model: User,
                    where: {
                        UserId: SocketUser.UserId
                    }
                }
            }
        })
        const ForwardCourseTostaff = await ForwardedCourse.create({
            CourseFK: Props.CoursePK,
            ForwardedCourseNotes: Props.Note,
            InstituteFK: GetInsId.InstituteId
        });
        // console.log(GetInsId)
        const StaffIds = await User.findAll({
            include: {
                model: InstituteUser,
                where: {
                    InstituteUserType: "Staff"
                },
                include: {
                    required: true,
                    model: Institute,
                    where: {
                        InstituteId: GetInsId.InstituteId
                    }
                }
            }
        })
        const NotificationData = StaffIds.map(value => {
            value = { ToUserId: value?.UserId, ToUserType: "InstituteStaff", NotificationType: "Add new course to Inventory", Message: "Admin wants to Add Automotive course to Inventory.", FromUserId: SocketUser?.UserId, FromUserType: "InstituteAdmin" }
            return value
        })

        const NotificationSend = await Notification.bulkCreate(NotificationData)

        let GetStaffUser = await User.findAll({

            include: {
                model: InstituteUser,
                where: { InstituteUserType: "Staff" },
                required: true,

                include: {
                    model: Institute,
                    where: { InstituteId: GetInsId?.InstituteId },
                    required: true,
                }
            }
        })
        GetStaffUser = GetStaffUser.filter((User) => {
            return GetSocketId(StafftArr, User?.UserId) !== undefined
        })


        GetStaffUser = await Promise.all(GetStaffUser.map(async value => {
            const AllNotifications = await Notification.findAll({
                where: { ToUserId: value.UserId },
                ...Paginate({ Page: 1, PageSize: 1 }),
                order: [['createdAt', "desc"]]
            })

            return { UserId: value?.UserId, Notifications: AllNotifications }
        }))
        
        GetStaffUser.forEach(async User => {
            let GetUser = GetSocketId(StafftArr, User.UserId);

            await new Promise((resolve, reject) => {
                InstituteStaff.to(GetUser?.SocketId).emit("CourseRecommended", User?.Notifications);
                resolve(true)
            })
        })
        // console.log(GetInsId?.InstituteId + "Staff")
    }
    catch (error) {
        console.log(`Error occurrred while recommending course: ${error}`)
    }
}