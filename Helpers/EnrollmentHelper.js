import db from "../Conn/connection.js"

const { CourseEnrollment } = db

export const EnrollInCourse = async (req, res, BoughtCourse) => {
    try {

        let Success = false;


        const EnrolledCourse = await CourseEnrollment.create({
            CoursePackageFK: BoughtCourse.CoursePackageFK,
            BoughtCourseFK: BoughtCourse.BoughtCourseFK,
            UserFK: req.UserId,
            InstallmentsPaid: req.body.Installments
        });
        if (EnrolledCourse)
            Success = true


        return {Success,  EnrolledCourse}
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
        return { error }
    }
}