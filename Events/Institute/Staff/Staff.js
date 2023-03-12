import db from "../../../Conn/connection.js";
import { AddUser, GetNotifications, RemoveUser } from "../../Common/Common.js";
import { FindUserId } from "../../Helpers/SaveUser.js";
import { GetInsFilteredVehicles } from "../Admin/InstituteAdmin.Events/Filters.js";
import { GetFilteredCourses, GetVehicleTypes } from "./Staff.Events/Staff.Events.js";
const { User, Institute, InstituteUser } = db

export let StafftArr = [[]];

export function StaffEvents(io) {
    io.on('connection', (socket) => {

        socket.on('SaveUser', async (props) => {
            StafftArr = AddUser(props, socket, StafftArr, io)
            const SocketUser = FindUserId(StafftArr, socket.id);

            const GetUser = await User.findOne({
                where: {
                    UserId: SocketUser.UserId,
                    User: "Institute"
                },
                include: {
                    model: InstituteUser,
                    where: { InstituteUserType: "Staff" },
                    required: true,

                    include: {
                        model: Institute,
                        required: true,
                    }
                }
            })
            
            socket.join(GetUser?.InstituteUser?.Institute?.InstituteId + "Staff");
            await GetNotifications(props, StafftArr, socket, io)
        });

        socket.on('RequestVehicleTypes', (props) => GetVehicleTypes(props, StafftArr, socket, io));

        socket.on('GetLicenseTypes', (props) => SortCourses(props, StafftArr, socket, io));

        socket.on('FilterAdminCourses', (props) => GetFilteredCourses(props, StafftArr, socket, io));
        socket.on('FilterVehicles', (props) => GetInsFilteredVehicles(props, StafftArr, socket, io));

        socket.on('disconnect', (props) => StafftArr = RemoveUser(props, socket, StafftArr, io))
    })
}
