import { AddUser, GetNotifications, RemoveUser } from "../Common/Common.js";
import { SortLicenseCourses, SortVehicleCourses } from "./Student.Events/Course.Events.js";


let StudentArr = [[]];

export function StudentEvents(io) {
    io.on('connection', (socket) => {

        socket.on('SaveUser', (props) => {
            StudentArr = AddUser(props, socket, StudentArr, io);
            GetNotifications(props, StudentArr, socket, io);
        });

        socket.on('LicenseSortCourse', (props) => SortLicenseCourses(props, StudentArr, socket, io));
        socket.on('VehicleSortCourse', (props) => SortVehicleCourses(props, StudentArr, socket, io));

        socket.on('disconnect', (props) => StudentArr = RemoveUser(props, socket, StudentArr, io))
    })
}
