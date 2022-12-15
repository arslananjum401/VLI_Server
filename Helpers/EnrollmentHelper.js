import db from "../Conn/connection.js"

const { CourseEnrollment } = db

export const EnrollInCourse = async (req, res, { BoughtCourse }) => {
    try {
        // req.body.CoursePackageFK = CoursePackageFK;
        // req.body.BoughtCourseFK = BoughtCourse;
        // req.body.UserFk = req.UserId;
        let Success = false;
        for (let i = 0; i < BoughtCourse.length; i++) {

            const EnrollCourse = await CourseEnrollment.create({
                CoursePackageFK: BoughtCourse[i].CoursePackageId,
                BoughtCourseFK: BoughtCourse[i].BoughtCourseFK,
                UserFK: req.UserId
            });
            if (EnrollCourse) {
                Success = true;
            }

        } 

        return Success
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
        return { error }
    }
}