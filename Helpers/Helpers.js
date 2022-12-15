import db from '../Conn/connection.js';
const { CourseEnrollment, sequelize, Course } = db;
export const CalculateRating = async (EnrollCourse) => {
    let s5Rating = await CourseEnrollment.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('CourseRating')), 'CourseRating']],
        where: {
            CourseRating: 5,
            EnrolledCourse: EnrollCourse
        },
        raw: true,
    })
    let s4Rating = await CourseEnrollment.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('CourseRating')), 'CourseRating']],
        where: {
            CourseRating: 4,
            EnrolledCourse: EnrollCourse
        },
        raw: true,
    })
    let s3Rating = await CourseEnrollment.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('CourseRating')), 'CourseRating']],
        where: {
            CourseRating: 3,
            EnrolledCourse: EnrollCourse
        },
        raw: true,
    })
    let s2Rating = await CourseEnrollment.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('CourseRating')), 'CourseRating']],
        where: {
            CourseRating: 2,
            EnrolledCourse: EnrollCourse
        },
        raw: true,
    })
    let s1Rating = await CourseEnrollment.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('CourseRating')), 'CourseRating']],
        where: {
            CourseRating: 1,
            EnrolledCourse: EnrollCourse
        },
        raw: true,
    })
    s5Rating = Number(s5Rating[0].CourseRating)
    s4Rating = Number(s4Rating[0].CourseRating)
    s3Rating = Number(s3Rating[0].CourseRating)
    s2Rating = Number(s2Rating[0].CourseRating)
    s1Rating = Number(s1Rating[0].CourseRating)

    const NewRating = ((5 * s5Rating + 4 * s4Rating + 3 * s3Rating + 2 * s2Rating + 1 * s1Rating) /
        (s5Rating + s4Rating + s3Rating + s2Rating + s1Rating))


    return NewRating;
}


export const ProgressBar = async (EnrolledCourse) => {
    if (!EnrolledCourse) {
        return;
    }
    let EnrollmentId = EnrolledCourse.EnrollmentId

    let CourseEnrollmentTime = await CourseEnrollment.findOne({
        where: {
            EnrollmentId
        }
    })

    let CoursePeriod = await Course.findOne({
        where: {
            CoursePK: CourseEnrollmentTime.EnrolledCourse
        }
    })

    let difference = ((CourseEnrollmentTime.EnrollmentPeriod.getTime()) / 100);

    let a = ((CourseEnrollmentTime.Completion - 1) * difference * 100) / CourseEnrollmentTime.EnrollmentPeriod.getTime()

    if (a > 100) {
        a = 100
    }
    else if (a < 0) {
        a = 0
    }

    CourseEnrollmentTime = await CourseEnrollment.update({
        Completion: a
    }, {
        where: {
            EnrollmentId
        }
    }
    )

    CourseEnrollmentTime = await CourseEnrollment.findOne({
        where: {
            EnrollmentId
        }
    })

    return CourseEnrollmentTime.Completion
}

export const CheckCompletion = async (SEnrolledCourse) => {
    try {
        if (SEnrolledCourse === null) {
            return
        }
        if (SEnrolledCourse.Completion > 90 && SEnrolledCourse.CompletionMark === false) {
            await CourseEnrollment.update({
                CompletionMark: true,
            },
                {
                    where: {
                        EnrollmentId: SEnrolledCourse.EnrollmentId
                    }
                }
            )
            const GetCourseForMark = await Course.findOne({
                where: {
                    CoursePK: SEnrolledCourse.EnrolledCourse
                }
            })

            await Course.update({
                Completed: (GetCourseForMark.Completed + 1)
            },
                {
                    where: {
                        CoursePK: SEnrolledCourse.EnrolledCourse
                    }
                }
            )
        }
    } catch (error) {
        console.log(`error occurred while checking completion: ${error}`)
    }
}


export const CheckRunningMark = async (EnrolledCourse) => {
    if (EnrolledCourse?.RunningMarked === false) {
        let GetCourse = await Course.findOne(
            {
                where: { CoursePK: EnrolledCourse.EnrolledCourse }
            });

        console.log(GetCourse.RunningCourse);

        GetCourse = await GetCourse.update(
            { RunningCourse: GetCourse.RunningCourse + 1 },
            { where: { CoursePK: EnrolledCourse.EnrolledCourse } });


        const asd = await CourseEnrollment.update(
            { RunningMarked: true },
            { where: { EnrollmentId: EnrolledCourse.EnrollmentId } }
        )
    }
}