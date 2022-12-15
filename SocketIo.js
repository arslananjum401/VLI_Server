import db from "./Conn/connection.js"
import { CheckInstituteUser } from "./Controllers/Common Controllers/CommonControllers.js";
const { Notification, Admin, Institute, User: UserModel } = db

let AdminUserIds = [];
let Institutes = [];
let StudentNames = []
export const SocketFunction = (io) => {
    io.on('connection', (socket) => {

        socket.on('SaveUser', async ({ UserId, UserType }) => {

            socket.join(UserId)
            if (UserType === "Admin") {
                AdminUserIds = UserId

            } else if (UserType === "Institute") {
                Institutes = UserId

            }
            else if (UserType === "Student") {
                StudentNames = UserId
            }


        })

        socket.on('InsituteRequest', async (data) => {
            const Message = `A request for a new Institute`;
            data.ToUserType = 'Admin'
            data.Message = Message;

            const GetAllAdmins = await UserModel.findAll({
                where: {
                    User: "Admin"
                }
            });

            await GetAllAdmins.map(async (value) => {
                data.ToUserId = value.UserId;
                data.ToUserType = value.User;

                const Result = await Notification.create(data);

            })


            const NotifictionsList = await Notification.findAll({
                where: {
                    ToUserType: "Admin"
                },
                order: [
                    ['createdAt', 'ASC'],
                ],

            });

            await io.to(AdminUserIds).emit('NotifyRequests', NotifictionsList)

        })

        socket.on('MarkNotification', async ({ NotificationsId, Message, Checked }) => {
            if (NotificationsId !== undefined) {


                await Notification.update(
                    {
                        MarkAsRead: Message
                    },
                    {
                        where: {
                            NotificationId: NotificationsId
                        }
                    }
                )
            }
            const NotifictionsList = await Notification.findAll({
                where: {
                    ToUserType: "Admin"
                },
                order: [
                    ['createdAt', 'ASC'],
                ],

            })



            await io.to(AdminUserIds).emit('MarkNotificationRes', NotifictionsList);
            if (Checked === true) {
                let Noti
                if (NotificationsId !== undefined) {
                    Noti = await Notification.findOne(
                        {
                            where: {
                                NotificationId: NotificationsId
                            }
                        }
                    )
                }
                let InstituteUserData
                if (Noti) {
                    InstituteUserData = await UserModel.findOne({
                        where: {
                            UserId: Noti.FromUserId
                        }
                    })
                }


                InstituteUserData = await CheckInstituteUser(InstituteUserData.dataValues, InstituteUserData.dataValues.UserId)
                if (InstituteUserData.ApplicationStatus === 'Accepted') {

                    await io.to(Noti.FromUserId).emit("NotifyInstituteFReq", InstituteUserData)
                }
            }
        })

        socket.on('disconnect', () => {

        })
    })


}