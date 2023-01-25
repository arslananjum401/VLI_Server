import { AddUser, RemoveUser } from "../Common/Common.js";

 

let AdminArr = [[]];


export function AdminEvents(io) {
    io.on('connection', (socket) => {
        socket.on('SaveUser', (props) => AdminArr = AddUser(props, socket, AdminArr));


        socket.on('disconnect', (props) => AdminArr = RemoveUser(props, socket, AdminArr))
    })
}