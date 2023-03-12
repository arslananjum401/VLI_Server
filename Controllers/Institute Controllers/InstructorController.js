import db from '../../Conn/connection.js'
import { CheckInstructorErrs } from '../../Helpers/ErrorChecker/InstructorChecker.js';
import { GetImage } from '../../Helpers/GetImages.js';
import bcrypt from 'bcrypt';
const { Instructor, Course, CourseEnrollment, User: UserModel, LicenseTypes, InstituteUser, InstituteCourses, CoursePackages, Institute, TimeTable } = db;

const CheckInstitute = (req) => {
    if (req.body.ApplicationStatus === "Pending" || req.body.InstituteStatus === "Not Working") {
        return res.status(401).json({ error: "For now, you are not eligible to perform this action" })
    }
}
const Query = (Id) => {
    const Q = {
        attributes: { exclude: ["UserId", "User", "createdAt"] },

        include: [
            {
                model: InstituteUser,
                attributes: ["InstituteUserType"],
                required: true,

            },
            {
                model: Instructor,
                where: {
                    InstructorId: Id,
                    Suspend: false
                },
                require: true,
                attributes: { exclude: ["Suspend", "UserFK", "FromInstitute"] },
                include: {
                    model: LicenseTypes,
                    attribute: ["LicenseTypeName"]
                }
            },
        ]
    }
    if (Id) {
        return Q
    }
    delete Q.include[1].where.InstructorId
    return Q
}


export const CreateInstructor = async (req, res) => {
    try {

        CheckInstitute(req)

        const CheckErrs = await CheckInstructorErrs(req)

        if (Object.entries(CheckErrs).length > 0)
            return res.status(403).json(CheckErrs)


        req.body.FromInstitute = req.User.Institute.InstituteId;
        req.body.UserName = req.body.FirstName + req.body.LastName;

        req.body.User = "Institute"

        const UserInstructor = await UserModel.create(req.body);
        let Password = UserInstructor.UserId.split('-')[0];
        Password = await bcrypt.hash(Password)
        req.body.UserFK = UserInstructor.UserId;
        const NewInstructor = await Instructor.create(req.body);


        await UserModel.update({ Password }, { where: { UserId: UserInstructor.UserId } })
        const addInstituteUser = await InstituteUser.create({
            InstituteUserType: "Instructor",
            InstituteFK: req.User.Institute.InstituteId,
            UserFK: UserInstructor.UserId
        })
        return res.status(201).json(NewInstructor)
    } catch (error) {
        console.log(`error occured while Creating Instructor ${error.message}`);
        // console.log(error)
        return res.status(500).json(error);
    }
}

export const UpdateInstructor = async (req, res) => {
    try {
        const CheckInstructor = await Instructor.findOne({
            where: {
                InstructorId: req.body.InstructorId
            }
        })

        if (!CheckInstructor || CheckInstructor.Suspend === true) {
            return res.status(201).json({ message: "the Instructor is not present or has been deleted" })
        }

        if (req.User.Institute.InstituteId !== CheckInstructor.FromInstitute) {
            return res.status(201).json({ message: "You cannot update this instructor" })
        }

        const ModifyInstructor = await Instructor.update(req.body, {
            where: {
                InstructorId: req.body.InstructorId
            }
        });

        const UpdatedInstructor = await UserModel.findOne({
            ...Query(req.body.InstructorId)
        })
        return res.status(201).json(UpdatedInstructor)
    } catch (error) {
        console.log(`error occured while Updating Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetSingleInstructor = async (req, res) => {
    try {
        let GetUserInstructor = await UserModel.findOne({
            ...Query(req.params.InstructorId),
        })

        if (!GetUserInstructor) {
            return res.status(200).json({ message: "Instructor not found" });
        }
        const InstructorInfo = GetUserInstructor.dataValues?.Instructor?.dataValues
        const Speciality = InstructorInfo.LicenseType?.dataValues?.LicenseTypeId;

        delete GetUserInstructor.dataValues?.Instructor
        delete InstructorInfo.LicenseType
        GetUserInstructor = { ...GetUserInstructor.dataValues, ...InstructorInfo, Speciality }

        return res.status(200).json(GetUserInstructor)
    } catch (error) {
        console.log(`error occured while Getting Single Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetAllInstructorsOfCourse = async (req, res) => {
    try {
        const FindCourse = await CourseEnrollment.findOne({
            where: { EnrollmentId: req.params.EnrollmentId },
            include: {
                model: CoursePackages,
                include: {
                    model: InstituteCourses,
                    required: true
                }
            }
        })

        const GetUserInstructor = await UserModel.findAll({
            include: [
                {
                    model: Instructor,
                    // required: true,
                    include: [{
                        model: InstituteCourses,
                        required: true,
                        where: { InstituteCourseId: FindCourse?.CoursePackage?.InstituteCourse?.InstituteCourseId }
                    },
                    { model: TimeTable },
                    { model: LicenseTypes }
                    ]
                },
                { model: InstituteUser, where: { InstituteUserType: "Instructor" } }
            ]
        })

        res.status(200).json(GetUserInstructor);
    } catch (error) {
        console.log(`error occured while Getting all Instructors of course ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const GetAllInstructorsOfInstitute = async (req, res) => {
    try {

        let GetInstructors = await UserModel.findAll({
            include: [
                {
                    required: true,
                    model: Instructor,
                    include: [
                        { model: TimeTable },
                        { model: LicenseTypes }
                    ]

                },
                {
                    model: InstituteUser, where: { InstituteUserType: "Instructor" },
                    include: [
                        {
                            model: Institute,
                            where: { InstituteId: req.User?.Institute?.InstituteId }
                        },

                    ]
                }

            ],
            order: [[Instructor, TimeTable, "start", "ASC"]]
        })
        GetInstructors = GetInstructors.map(value => {
            if (value?.Instructor?.TimeTable === null)
                value.Instructor.Status = "Free"
            return value
        })
        // GetInstructors = GetInstructors.filter(value => {
        //     return value?.Instructor?.TimeTable !== null
        // })
        res.status(200).json(GetInstructors);
    } catch (error) {
        console.log(`error occured while Getting all Instructors of Institute ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const DeleteInstructors = async (req, res) => {
    try {
        const CheckInstructor = await Instructor.findOne({
            where: {
                InstructorId: req.params.InstructorId,
                Suspend: false
            }
        })
        if (!CheckInstructor) {
            return res.status(403).json({ message: "Instructor not found or has been deleted" })
        }
        const TobeDeleted = await Instructor.update(
            {
                Suspend: true
            },
            {
                where: {
                    InstructorId: req.params.InstructorId
                }
            });


        res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (error) {
        console.log(`error occured while Deleting all Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}




















export const StudentReport = async (req, res) => {
    try {
        const Student = await CourseEnrollment.findAll({
            include: [{
                model: Course,
                where: {
                    ByInstitute: req.User.InstituteId
                }
            },
            {
                model: UserModel,
                where: {
                    User: "Student"
                },
                attributes: ["UserName"]
            }
            ]
        })
        res.status(200).json(Student)
    } catch (error) {
        console.log(`error occurred while getting student Report: ${error}`)
        return res.status(500).json({ error });
    }
}

export const GetCourseReport = async (req, res) => {
    try {
        const CourseReport = await Course.findAll({
            where: {
                ByInstitute: req.User.InstituteId
            }
        })
        res.status(200).json(CourseReport)
    } catch (error) {
        console.log(`error occurred while getting course Report: ${error}`)
        return res.status(500).json({ error });
    }
}



export const GetAvailableInstrutors = async (req, res) => {
    try {
        const AvailableInstrutors = await Instructor.findAll({
            where: {
                Suspend: false,
                Available: true
            }
        })
        res.status(200).json(AvailableInstrutors);
    } catch (error) {
        console.log(`error occurred while getting Available Instructors: ${error}`)
        return res.status(500).json({ error });
    }
}


export const GetInstructorImage = async (req, res, next) => {
    try {

        if (req.query.url.search(/Instructor/i) > -1 && req.url.search(/Instructor\/Images/i) > -1)
            GetImage(req, res)
        else
            res.status(200).json({ Message: "Image not found" })


    } catch (error) {

    }
}