import { AddUserToArr, RemoveUserFromArr } from "../Helpers/SaveUser.js";

export const AddUser = (Props, socket, Arr) => {

    const User = { SocketId: socket.id, UserId: Props.UserId };
 
    return AddUserToArr(Arr, User)
}

export const RemoveUser = (Props, socket, Arr) => {
    const User = { SocketId: socket.id, UserId: Props.UserId };
    return RemoveUserFromArr(Arr, User);
}
