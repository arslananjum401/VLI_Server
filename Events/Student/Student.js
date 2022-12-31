import { AddUser, RemoveUser } from "../Common/Common.js";

let StudentArr = [[]];
 
export function StudentEvents(io) {
    io.on('connection', (socket) => {
 
        socket.on('SaveUser', (props) => StudentArr = AddUser(props, socket, StudentArr));


        socket.on('disconnect', (props) => StudentArr = RemoveUser(props, socket, StudentArr))
    })
}
