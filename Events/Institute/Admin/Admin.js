import { AddUser, GetNotifications, RemoveUser } from "../../Common/Common.js";
import { ApproveNewCourse, RecommendCourse, RejectNewCourse } from './InstituteAdmin.Events/InstituteAdmin.Events.js'
import { GetInsAdminFilteredCourses, GetInsFilteredVehicles } from './InstituteAdmin.Events/Filters.js'
let InsAdminArr = [[]];

export function InstituteAdminEvents(io) {
    io.on('connection', (socket) => {

        socket.on('SaveUser', (props) => {
            InsAdminArr = AddUser(props, socket, InsAdminArr, io);
            GetNotifications(props, InsAdminArr, socket, io);
            console.log(InsAdminArr)
        });

        socket.on('FilterInsAdminCourses', (props) => GetInsAdminFilteredCourses(props, InsAdminArr, socket, io));
        socket.on('RejectCourse', (props) => RejectNewCourse(props, InsAdminArr, socket, io));
        socket.on('ApproveCourse', (props) => ApproveNewCourse(props, InsAdminArr, socket, io));
        socket.on('RecommendCourse', (props) => RecommendCourse(props, socket, InsAdminArr, io));
        socket.on('FilterVehicles', (props) => GetInsFilteredVehicles(props, InsAdminArr, socket, io));

        socket.on('disconnect', (props) => InsAdminArr = RemoveUser(props, socket, InsAdminArr, io))
    })
}
