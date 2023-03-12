import { AddUser, GetNotifications, RemoveUser } from "../Common/Common.js";
import { SortBooks } from "./Admin.Events.js";



let AdminArr = [[]];


export function AdminEvents(io) {
    io.on('connection', (socket) => {
        socket.on('SaveUser', (props) => {
            AdminArr = AddUser(props, socket, AdminArr);
            GetNotifications(props, AdminArr, socket, io);
        });

        // socket.on('GetNotifications', (props) => GetNotifications(props, AdminArr, socket, io));
        socket.on('FilterBooks', (props) => SortBooks(props, socket, AdminArr, io));

        socket.on('disconnect', (props) => AdminArr = RemoveUser(props, socket, AdminArr))
    })
}