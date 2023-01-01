import { AddUserToArr, RemoveUserFromArr } from "../Helpers/SaveUser.js";

export const AddUser = (Props, socket, Arr) => {

    const User = { SocketId: socket.id, ...Props };

    return AddUserToArr(Arr, User)
}

export const RemoveUser = (Props, socket, Arr) => {
    const User = { SocketId: socket.id, ...Props};
    return RemoveUserFromArr(Arr, User);
}
