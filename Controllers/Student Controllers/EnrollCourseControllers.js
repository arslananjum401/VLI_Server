
import db from '../../Conn/connection.js'
import { CheckCompletion, CheckRunningMark } from '../../Helpers/Helpers.js';

const { CourseEnrollment, Course, CoursePackages, InstituteCourses, CourseProgress, ClassSchedule, User, TimeTable } = db;


export const GetEnrolledCourses = async (req, res) => {
    try {

        const EnrolledCourses = await CourseEnrollment.findAll({
            where: { UserFK: req.UserId },
            attributes: ["EnrollmentId"],
            include: [
                {
                    model: CoursePackages, attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours"],
                    include: {
                        model: InstituteCourses, attributes: ["InstituteCourseId", "ShortDescription", "LongDescription", "Possible_FAQs"],
                        // where: { Publish: true }
                        include: { model: Course, attributes: ["CoursePK", "CourseName", "Description", "CourseThumbnail"] }
                    }
                }
            ],
            order:[["createdAt","DESC"]]
        })


        res.status(200).json(EnrolledCourses);
    } catch (error) {
        console.log(`error occurred while Getting Enrolled courses: ${error}`);
        return res.status(500).json(error);
    }
}



export const GetSingleEnrolledCourse = async (req, res) => {
    try {
        let where
        if (req.User.User === "Student")
            where = { where: { UserFK: req.UserId, EnrollmentId: req.params.EnrollmentId } }
        else if (req.User.User === "Institute")
            where = { where: { EnrollmentId: req.params.EnrollmentId } }




        const SEnrolledCourse = await CourseEnrollment.findOne({
            ...where,

            attributes: ["EnrollmentId"],
            include: [{
                model: CoursePackages, attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours"],
                include: {
                    model: InstituteCourses, attributes: ["InstituteCourseId", "ShortDescription", "LongDescription", "Possible_FAQs"],
                    // where: { Publish: true }
                    include: [
                        { model: Course, attributes: ["CoursePK", "CourseName", "Description", "CourseThumbnail"] },

                        { model: ClassSchedule, attributes: { exclude: ["createdAt", "InstituteCourseFK"] } },
                    ]
                }
            },
            {
                model: User
            }
            ]


        })

        let EnrolledCourseSyllabus = await SEnrolledCourse.CoursePackage.InstituteCourse.getCourseSyllabuses({ attributes: ["CourseSyllabusId", "CourseDescription"] });

        SEnrolledCourse.dataValues.CoursePackage.dataValues.InstituteCourse.dataValues.CourseSyllabuse = EnrolledCourseSyllabus
        // CheckRunningMark(SEnrolledCourse);
        // await CheckCompletion(SEnrolledCourse);

        res.status(200).json(SEnrolledCourse)
    } catch (error) {
        console.log(`error occurred while Getting Single Enrolled Course: ${error}`);
        return res.status(500).json(error);
    }
}

export const GetCourseProgress = async (req, res) => {
    try {
        let where
        if (req.User.User === "Student")
            where = { where: { UserFK: req.UserId, EnrollmentId: req.params.EnrollmentId } }
        else if (req.User.User === "Institute")
            where = { where: { EnrollmentId: req.params.EnrollmentId } }

        const SEnrolledCourse = await CourseEnrollment.findOne({
            ...where,
            attributes: ["EnrollmentId"],
            include: [{
                model: CoursePackages, attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours"],
                include: {
                    model: InstituteCourses, attributes: ["InstituteCourseId", "ShortDescription", "LongDescription", "Possible_FAQs"],
                    // where: { Publish: true }
                    include: [
                        { model: Course, attributes: ["CoursePK", "CourseName", "Description", "CourseThumbnail"] },

                        { model: ClassSchedule, attributes: { exclude: ["createdAt", "InstituteCourseFK"] } },
                    ]
                }
            },

            ]


        })

        let EnrolledCourseSyllabus = await SEnrolledCourse.CoursePackage.InstituteCourse.getCourseSyllabuses({ attributes: ["CourseSyllabusId", "CourseDescription"] });
        SEnrolledCourse.dataValues.CoursePackage.dataValues.InstituteCourse.dataValues.CourseSyllabuse = EnrolledCourseSyllabus


        const CourseProgressObj = await CourseProgress.findAll({ where: { EnrollmentFK: req.params.EnrollmentId } })

        res.status(200).json({ CourseProgress: CourseProgressObj, EnrolledCourse: SEnrolledCourse });

    } catch (error) {
        console.log(`error occurred while Getting Course Progress: ${error}`);
        return res.status(500).json(error);
    }
}

export const GetTimeTable = async (req, res) => {

    try {
        let GetTimeTable = await TimeTable.findAll(req.body, {
            where: {
                EnrollmentId: req.params.EnrollmentId
            }
        })
        GetTimeTable = GetTimeTable.map(value => {
            value = value.dataValues;
            if (value?.ClassType)


                return { ...value, editable: false, deletable: false, draggable: false, disabled: false }
        })
        res.status(200).json(GetTimeTable)
    } catch (error) {
        console.log(`error occurred while UnEnrolling courses: ${error}`);
        return res.status(500).json(error);
    }
}
export const UnEnrollCourse = async (req, res) => {
    req.body.EnrollmentStatus = false;
    req.body.EnrollmentPeriod = Date.now();
    try {
        const UnEnrollCourse = await CourseEnrollment.update(req.body, {
            where: {
                EnrollmentId: req.body.EnrollmentId
            }
        })
        res.status(204).end()
    } catch (error) {
        console.log(`error occurred while UnEnrolling courses: ${error}`);
        return res.status(500).json(error);
    }
}


export const GetUnEnrolledCourses = async (req, res) => {
    try {
        const UnEnrollCourses = await CourseEnrollment.findAll({
            where: {
                StudentId: req.UserId,
                EnrollmentStatus: false
            }
        })

        res.status(200).json(UnEnrollCourses);
    } catch (error) {
        console.log(`error occurred while Getting UnEnrolled courses: ${error}`);
        return res.status(500).json(error);
    }
}

