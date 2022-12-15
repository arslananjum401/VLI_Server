export const CheckStudent = async (InterestModel, UserInfo) => {
    if (UserInfo.User === 'Student') {
        const Student = await InterestModel.findOne({
            where: {
                StudentId: UserInfo.UserId
            }
        })
        if (Student) {
            return Student.dataValues;
        }
    }
}