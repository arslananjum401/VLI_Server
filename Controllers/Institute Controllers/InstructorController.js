import { response } from 'express';
import { Op } from 'sequelize';
import db from '../../Conn/connection.js'
const { Instructor, Course, Institute, Product, CourseEnrollment, User: UserModel, LicenseTypes, InstituteUser } = db;

const CheckInstitute = (req) => {
    if (req.body.ApplicationStatus === "Pending" || req.body.InstituteStatus === "Not Working") {
        return res.status(401).json({ error: "For now, you are not eligible to perform this action" })
    }
}
const Query = (Id) => {
    const Q = {
        attributes: { exclude: ["createdAt"] },
        include: [
            {
                model: InstituteUser,
                attributes: ["InstituteUserType"],
                required: true
            },
            {
                model: Instructor,
                where: {
                    InstructorId: Id,
                    Suspend: false
                },
                require: true,
                attributes: { exclude: ["createdAt", "Suspend"] },
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
        const CheckInstructor = await Instructor.findOne({
            where: {
                [Op.or]: [
                    { LicenseNumber: req.body.LicenseNumber },
                    { SpecialLicenseNumber: req.body.SpecialLicenseNumber }
                ]

            }
        })
        if (CheckInstructor) {
            return res.status(403).json({ message: "Instructor Credentials already exists" })
        }



        req.body.FromInstitute = req.User.Institute.InstituteId;
        req.body.UserName = req.body.FirstName + req.body.LastName;
        req.body.User = "Institute"

        const UserInstructor = await UserModel.create(req.body);
        req.body.UserFK = UserInstructor.UserId;
        const NewInstructor = await Instructor.create(req.body);
        
        const addInstituteUser = await InstituteUser.create({
            InstituteUserType: "Staff",
            InstituteFK: req.User.Institute.InstituteId,
            Institute_UserFK: UserInstructor.UserId
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
        const GetUserInstructor = await UserModel.findOne({
            ...Query(req.params.InstructorId)
        })

        if (!GetUserInstructor) {
            return res.status(200).json({ message: "Instructor not found" });
        }

        return res.status(200).json(GetUserInstructor)
    } catch (error) {
        console.log(`error occured while Getting Single Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const GetAllInstructors = async (req, res) => {
    try {
        const GetUserInstructor = await UserModel.findAll({
            ...Query()
        })

        
        res.status(200).json(GetUserInstructor);
    } catch (error) {
        console.log(`error occured while Getting all Instructor ${error.message}`);
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