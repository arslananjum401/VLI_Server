import { AddUser, RemoveUser } from "../../Common/Common.js";
import { GetVehicleTypes } from "./Staff.Events/Staff.Events.js";


let StafftArr = [[]];

export function StaffEvents(io) {
    io.on('connection', (socket) => {

        socket.on('SaveUser', (props) => StafftArr = AddUser(props, socket, StafftArr, io));

        socket.on('RequestVehicleTypes', (props) => GetVehicleTypes(props, StafftArr, socket, io));
        socket.on('GetLicenseTypes', (props) => SortCourses(props, StafftArr, socket, io));


        socket.on('disconnect', (props) => StafftArr = RemoveUser(props, socket, StafftArr, io))
    })
}
 