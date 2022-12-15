import db from '../../Conn/connection.js'
import { CheckCompletion, CheckRunningMark } from '../../Helpers/Helpers.js';
import { ModifyCourseEnrollmentObj } from '../../Helpers/ChangeObject.js';
import { ArrangeCourseObject } from '../../Helpers/ChangeObject.js';

const { CourseEnrollment, Course, VehicleTypes, Product, LicenseTypes, Institute, sequelize } = db;

export const EnrollCourse = async (req, res) => {
    req.body.StudentId = req.UserId;
    req.body.EnrollmentPeriod = Date.now() + 1 * 365 * 24 * 60 * 60 * 1000;
    req.body.EnrollmentStatus = true;


    try {
        let course;

        const CheckCourseEnrollment = await CourseEnrollment.findOne({
            where: {
                EnrolledCourse: req.body.EnrolledCourse,
                EnrolledProduct: req.body.EnrolledProduct,
                StudentId: req.body.StudentId
            }
        });

        if (CheckCourseEnrollment) {//Checking if user had ever enrolled for this course
            if (CheckCourseEnrollment.EnrollmentStatus === false) {
                const UpdatedCourse = await CourseEnrollment.update(
                    req.body,
                    {
                        where: {
                            EnrollmentId: CheckCourseEnrollment.EnrollmentId
                        }
                    })

                course = await Product.findOne({
                    where: {
                        ProductId: CheckCourseEnrollment.EnrolledProduct
                    },
                    include: [
                        {
                            model: LicenseTypes,
                            attributes: ["LicenseTypeName"],
                            required: true,
                        },
                        {
                            model: Course,
                            required: true,
                            include: {
                                model: Institute,
                                attributes: ["InstituteName"],
                                required: true,
                            }
                        }]

                })
                course = ArrangeCourseObject(course)
                const EnrollmentCourse = await CourseEnrollment.findOne({
                    where: {
                        EnrollmentId: CheckCourseEnrollment.EnrollmentId
                    }
                })

                const OBJ = await ModifyCourseEnrollmentObj(EnrollmentCourse.dataValues)
                return res.status(201).json({ course, EnrollmentCourse: OBJ });
            } else {
                return res.status(403).json({ message: "You have already been enrolled." });
            }
        }
        req.body.RunningMarked = true
        const EnrolledCourse = await CourseEnrollment.create(req.body);
        if (!EnrolledCourse.RunningMarked) {
            const MarkRunningCourse = await Course.update({ RunningCourses: sequelize.literal('RunningCourses + 1') })
        }

        course = await Product.findOne({
            where: {
                ProductId: req.body.EnrolledProduct
            },
            include: [
                {
                    model: LicenseTypes,
                    attributes: ["LicenseTypeName"],
                    required: true,
                },
                {
                    model: Course,
                    required: true,
                    include: {
                        model: Institute,
                        attributes: ["InstituteName"],
                        required: true,
                    }
                }]

        })

        const OBJ = await ModifyCourseEnrollmentObj(EnrolledCourse)

        course = ArrangeCourseObject(course)
        res.status(200).json({ course, EnrollmentCourse: OBJ });
    } catch (error) {
        console.log(`error occurred while Enrolling course: ${error}`);
        return res.status(500).json(error);
    }
}



export const GetEnrolledCourses = async (req, res) => {
    try {

        const EnrolledCourses = await CourseEnrollment.findAll({
            where: {
                StudentId: req.UserId,
                EnrollmentStatus: true
            },
            order: [
                ['createdAt', 'ASC'],
            ],
        })

        const filteredES = await EnrolledCourses.filter(async (value) => {
            if (value.EnrollmentPeriod < Date.now()) {
                await CourseEnrollment.update({
                    EnrollmentStatus: false,
                },
                    {
                        where: {
                            EnrollmentId: value.EnrollmentId
                        }
                    }
                )
            }
            return value.EnrollmentStatus === true
        })

        res.status(200).json({ EnrollmentCourse: filteredES });
    } catch (error) {
        console.log(`error occurred while Getting Enrolled courses: ${error}`);
        return res.status(500).json(error);
    }
}



export const GetSingleEnrolledCourse = async (req, res) => {
    try {

        let SEnrolledCourse = await CourseEnrollment.findOne({
            where: {
                StudentId: req.UserId,
                EnrolledProduct: req.params.CoursePK,
                EnrollmentStatus: true
            }
        })
        if (SEnrolledCourse && SEnrolledCourse.EnrollmentPeriod < Date.now()) {
            SEnrolledCourse = await CourseEnrollment.update({
                EnrollmentStatus: false,
            },
                {
                    where: {
                        EnrollmentId: SEnrolledCourse.EnrollmentId
                    }
                }
            )
        }
        SEnrolledCourse = await CourseEnrollment.findOne({
            where: {
                StudentId: req.UserId,
                EnrolledProduct: req.params.CoursePK,
                EnrollmentStatus: true
            }
        })



        const OBJ = await ModifyCourseEnrollmentObj(SEnrolledCourse?.dataValues)
        CheckRunningMark(SEnrolledCourse);
        await CheckCompletion(SEnrolledCourse);

        let GetCourse = await Product.findOne({
            where: {
                ProductId: req.params.CoursePK
            },
            include: [
                {
                    model: Institute,
                    attributes: ["InstituteName"],
                    required: true,
                },
                {
                    model: Course,
                    required: true,
                    include: [
                        {
                            model: LicenseTypes,
                            attributes: ["LicenseTypeName", "LicenseTypeId"],
                            required: true
                        },
                        {
                            model: VehicleTypes,
                            attributes: ["VehicleTypeName", "VehicleTypeId"],
                            required: true
                        }

                    ]
                }
            ]

        })
        GetCourse = ArrangeCourseObject(GetCourse)

        res.status(200).json({ CourseEnrollment: OBJ, Course: GetCourse })
    } catch (error) {
        console.log(`error occurred while Getting Single Enrolled Course: ${error}`);
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

