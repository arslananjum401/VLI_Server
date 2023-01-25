import { AddUser, RemoveUser } from "../Common/Common.js";
import { SortCourses } from "./Student.Events/Course.Events.js";


let StudentArr = [[]];

export function StudentEvents(io) {
    io.on('connection', (socket) => {

        socket.on('SaveUser', (props) => StudentArr = AddUser(props, socket, StudentArr, io));

        socket.on('SortCourse', (props) => SortCourses(props, StudentArr, socket, io));


        socket.on('disconnect', (props) => StudentArr = RemoveUser(props, socket, StudentArr, io))
    })
}
 