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
            const { SocketId } = ChildValue;
            if (RemoveUser.SocketId !== SocketId)
                return ChildValue
        })
        return arr.length !== 0
    })


}


export const FindUserId = (UserArr, SocketId) => {
    let User
    UserArr.forEach((value, Index) => {
        value.forEach((ChildValue, ChildIndex) => {
            const { SocketId: SavedSocketId } = ChildValue

            if (SavedSocketId === SocketId) {
                User = ChildValue
            }
        })
    })

    return User
}
export const GetSocketId = (UserArr, GivenUserId) => {
    let User
    UserArr.forEach((value, Index) => {
        value.forEach((ChildValue, ChildIndex) => {
            const { SocketId: SavedSocketId, UserId } = ChildValue
      
            if (GivenUserId === UserId) {
                User = ChildValue
            }
        })
    })

    return User
}