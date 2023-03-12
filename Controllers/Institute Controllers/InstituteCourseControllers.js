
import db from "../../Conn/connection.js";
import { CheckUUID } from "../../Helpers/CheckUUID.js";
import { ParseFAQs, StringifyFQAs } from "../../Helpers/DataParsersAndStringify.js";
import { DeleteFile } from "../../Helpers/DeleteMedia.js";

const { InstituteCourses, Institute, CourseSyllabus, Course, ClassSchedule, CoursePackages, Instructor, Vehicle, User, CourseInstructors, CourseEnrollment, TimeTable, IE_Relation, LicenseTypes, VehicleTypes, StudentInfo } = db;
const Query = [
    {
        model: Instructor,
        // where: { Suspend: false },
        attributes: ["InstructorId", "PhoneNumber", "LicenseNumber"],
        include: { model: User, attributes: ["FirstName", "LastName"] }
    },
    { model: Vehicle, attributes: ["VehicleId", "Manufacturer", "Model", "Year", "PlateNumber"] },
    { model: CoursePackages, attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours", "TotalFee", "Installments"] },
    {
        model: Course, attributes: ["CoursePK", "Description", "CourseName"],
        include: [
            {
                model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"]
            },
            {
                model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"]
            }
        ]
    },
    { model: Institute, attributes: ["InstituteName"] },
    { model: CourseSyllabus, attributes: { exclude: ["InstituteCourseFK"] } },
    { model: ClassSchedule, attributes: { exclude: ["InstituteCourseFK"] } },
];

export const AddCourseToInstitute = async (req, res) => {
    req.body.Publish = false;
    if (!req.body.Packages)
        return res.status(401).json({ message: "Curriculum is required" })

    if (!CheckUUID(req.body.CourseFK))
        return res.status(200).json({ message: "Invalid UUID" })

    try {
        const CheckInstituteCourse = await InstituteCourses.findOne({
            where: {
                InstituteFK: req.User.Institute.InstituteId,
                CourseFK: req.body.CourseFK
            },
        })

        if (CheckInstituteCourse)
            return res.status(401).json({ message: "Course already addedd" });

        const GetCourse = await Course.findOne({ where: { CoursePK: req.body.CourseFK } })

        req.body.InstituteFK = req.User.Institute.InstituteId;
        req.body.CourseFK = GetCourse.CoursePK;

        StringifyFQAs(req)
        const InstituteCourseCreated = await InstituteCourses.create(req.body)

        req.body.Packages = req.body.Packages.map(value =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await CoursePackages.bulkCreate(req.body.Packages);


        req.body.Instructors = req.body.Instructors.map(value =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await CourseInstructors.bulkCreate(req.body.Instructors);


        req.body.CourseSyllabus = req.body.CourseSyllabus.map(value =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })

        await CourseSyllabus.bulkCreate(req.body.CourseSyllabus);


        req.body.ClassSchedule = req.body.ClassSchedule.map(value =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await ClassSchedule.bulkCreate(req.body.ClassSchedule);


        const InstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: InstituteCourseCreated.InstituteCourseId },
            include: Query
        })

        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while adding course to Institute: ${error}`);
        return res.status(500).json({ error });
    }
}

export const UpdateInstituteCourse = async (req, res) => {
    req.body.Publish = false
    const { CoursePackages: CoursePackagesArr } = req.body
    try {
        const GetInstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.body.InstituteCourseId },
        })

        if (!GetInstituteCourse) return res.status(404).json({ message: "Course not found or has been deleted" })

        if (req.body.UpdateCourseCurriculum)
            req.body.CourseCurriculum = req.body.UpdateCourseCurriculum


        if (req.body.InstituteCourseId) {
            const UpdateCourse = await InstituteCourses.update(req.body, { where: { InstituteCourseId: req.body.InstituteCourseId } });
        }


        if (CoursePackagesArr?.length > 0) {
            await CoursePackagesArr.forEach(async (value) => {
                const UpdateCoursePackage = await CoursePackages.update(value, { where: { CoursePackageId: value.CoursePackageId } })
            })
        }

        if (req.body.UpdateCourseCurriculum)
            DeleteFile(InstituteCourses, GetInstituteCourse, GetInstituteCourse.CourseCurriculum, "InstituteCourseId")

        const GetUpdatedInstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.body.InstituteCourseId },
            include: Query
        })
        ParseFAQs(GetUpdatedInstituteCourse);

        res.status(200).json(GetUpdatedInstituteCourse)
    } catch (error) {
        console.log(`error occurred while updating course of Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}


export const GetInstituteCourses = async (req, res) => {
    try {
        const InstituteCourse = await InstituteCourses.findAll({
            where: { InstituteFK: req.User.Institute.InstituteId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: Query

        })

        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const ApproveRejectInstituteCourses = async (req, res) => {
    try {
        const ApproveInstituteCourse = await InstituteCourses.update(req.body, {
            where: { InstituteCourseId: req.body.InstituteCourseId }
        })
        const InstituteCourse = await InstituteCourses.findAll({
            where: { InstituteFK: req.User.Institute.InstituteId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: Query

        })

        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const RemoveCourseFromInstitute = async (req, res) => {
    try {

        const GetInstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.body.InstituteCourseId },
            include: Query
        })
        if (!GetInstituteCourse) {
            return res.status(404).json({ message: "Course not for Institute or has been deleted" })
        }

        if (GetInstituteCourse.CourseCurriculum)
            DeleteFile(null, GetInstituteCourse, GetInstituteCourse.CourseCurriculum, "InstituteCourseId")


        const DeleteInstituteCourse = await InstituteCourses.destroy({
            where: { InstituteCourseId: GetInstituteCourse.InstituteCourseId }
        });
        const InstituteCourses = await InstituteCourses.findAll({
            where: { InstituteFK: req.User.Institute.InstituteId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: Query

        })
        res.status(200).json({ message: "Course Deleted Successfully", InstituteCourses })
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}



export const GetSingleInstituteCourse = async (req, res) => {
    try {


        Query[2].include = { model: CourseEnrollment }

        const InstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.params.InstituteCourseId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: Query
        })
        InstituteCourse?.CoursePackages?.forEach((value, index) => {
            if (value?.dataValues.CourseEnrollment)
                InstituteCourse.dataValues.Enrolled = true
        })
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while Getting single institute course: ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetClassSchedule = async (req, res) => {
    try {

        const GetCoursePackages = await CourseEnrollment.findOne({
            where: { EnrollmentId: req.params.EnrollmentId },
            include: {
                model: CoursePackages,
                include: {
                    model: InstituteCourses,
                    include: {
                        model: ClassSchedule
                    }
                }
            }
        });

        const GetStudentInfo = await CourseEnrollment.findOne({
            include: [
                {
                    model: User,
                    include: {
                        model: StudentInfo
                    }
                },
            ]
        })

        GetCoursePackages?.CoursePackage?.InstituteCourse

        res.status(200).json(GetCoursePackages?.CoursePackage?.InstituteCourse?.ClassSchedules)
    } catch (error) {
        console.log(`error occurred while Getting single institute course: ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const CreateTimeTableByStaff = async (req, res) => {
    try {

        const NewSchedule = await TimeTable.bulkCreate(req.body.Events)
        const AlotInstructor = await IE_Relation.bulkCreate(req.body.AssignedInstructors)


        res.status(200).json(NewSchedule)
    } catch (error) {
        console.log(`error occurred while Getting single institute course: ${error.message}`);
        return res.status(500).json({ error });
    }
}

