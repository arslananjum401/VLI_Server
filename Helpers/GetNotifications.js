export const GetNotifications = async (NotificationModel, Info, Id) => {
    try {
        // console.log(Info)
        const Notifications = await NotificationModel.findAll({
            where: {
                ToUserId: Id,
                ToUserType: Info.User,
            }
        })

        return Notifications;
    } catch (error) {
        console.log(`Error Occurred while Getting Notifications ${error.message}`);
    }
}