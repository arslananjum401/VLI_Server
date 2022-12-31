export const AddUserToArr = (UserArr, NewUser) => {
    let Check = false;
    UserArr?.forEach((value, Index) =>
        value?.forEach((ChildValue, ChildIndex) => {
            let { UserId } = ChildValue;
            if (NewUser.UserId === UserId) {
                UserArr[Index].push(NewUser)
                Check = true;
            }
        })
    )
    if (!Check)
        UserArr.push([NewUser])
        
    return UserArr
}
export const RemoveUserFromArr = (UserArr, RemoveUser) => {
    return UserArr?.filter((value, index) => {
        let arr = value?.filter((ChildValue) => {
            let { SocketId } = ChildValue;
            if (RemoveUser.SocketId !== SocketId) {
                // console.log(RemoveUser.SocketId, SocketId)
                return ChildValue
            }

        })

        return arr.length !== 0
    })


}
