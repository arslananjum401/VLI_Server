import db from "../../Conn/connection.js";
import { Paginate } from "../../Helpers/Paginate.js";
import { AddUserToArr, FindUserId, RemoveUserFromArr } from "../Helpers/SaveUser.js";
const { Notification } = db
export const AddUser = (Props, socket, Arr) => {

    const User = { SocketId: socket.id, ...Props };
    return AddUserToArr(Arr, User)
}
export const RemoveUser = (Props, socket, Arr) => {
    const User = { SocketId: socket.id };
    return RemoveUserFromArr(Arr, User);
}


export const GetNotifications = async (props, UserArr, socket, io) => {
    try {
        const SocketUser = FindUserId(UserArr, socket.id);


        const UserNotifications = await Notification.findAll({
            where: {
                ToUserId: SocketUser.UserId
            },
            order: [['createdAt', "desc"]],
            ...Paginate({ Page: 0, PageSize: 5 })
        });
        
        socket.emit("SendNotifications", UserNotifications)
    } catch (error) {
        console.log(error)
    }
}