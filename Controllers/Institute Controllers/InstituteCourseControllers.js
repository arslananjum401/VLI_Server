
import db from "../../Conn/connection.js";
import { CheckUUID } from "../../Helpers/CheckUUID.js";
import { ParseFAQs, StringifyFQAs } from "../../Helpers/DataParsersAndStringify.js";
import { DeleteFile } from "../../Helpers/DeleteMedia.js";

const { InstituteCourses, Institute, CourseSyllabus, Course, ClassSchedule, CoursePackages, Instructor, Vehicle, User, CourseInstructors } = db;
const Query = [
    {
        model: Instructor,
        where: { Suspend: false },
        attributes: ["InstructorId", "PhoneNumber", "LicenseNumber"],
        include: { model: User, attributes: ["FirstName", "LastName"] }
    },
    { model: Vehicle, attributes: ["VehicleId", "ManufacturingCompany", "Model", "Year", "PlateNumber"] },
    { model: CoursePackages, attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours", "TotalFee"] },
    { model: Course, attributes: ["CoursePK", "Description", "RunningCourse", "Promotion"] },
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

        if (CheckInstituteCourse) {
            return res.status(401).json({ message: "Course already addedd" });
        }



        const GetCourse = await Course.findOne({ where: { CoursePK: req.body.CourseFK } })

        req.body.InstituteFK = req.User.Institute.InstituteId;
        req.body.CourseFK = GetCourse.CoursePK;

        StringifyFQAs(req)
        const InstituteCourseCreated = await InstituteCourses.create(req.body)

        req.body.Packages = req.body.Packages.map((value) =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await CoursePackages.bulkCreate(req.body.Packages);


        req.body.Instructors = req.body.Instructors.map((value) =>
            value = { InstructorFK: value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await CourseInstructors.bulkCreate(req.body.Instructors);


        req.body.CourseSyllabus = req.body.CourseSyllabus.map((value) =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })

        await CourseSyllabus.bulkCreate(req.body.CourseSyllabus);


        req.body.ClassSchedule = req.body.ClassSchedule.map((value) =>
            value = { ...value, InstituteCourseFK: InstituteCourseCreated.InstituteCourseId })
        await ClassSchedule.bulkCreate(req.body.ClassSchedule);


        const InstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: InstituteCourseCreated.InstituteCourseId },
            include: Query

        })

        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while adding course to Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}


export const UpdateInstituteCourse = async (req, res) => {
    req.body.Publish = false
    try {
        const GetInstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.body.InstituteCourseId },
        })

        if (!GetInstituteCourse) return res.status(404).json({ message: "Course not found or has been deleted" })


        req.body.CourseCurriculum = req.body.UpdateCourseCurriculum
        const UpdateCourse = await InstituteCourses.update(req.body, { where: { InstituteCourseId: req.body.InstituteCourseId } })

        if (req.body.UpdateCourseCurriculum)
            DeleteFile(InstituteCourses, GetInstituteCourse, GetInstituteCourse.CourseCurriculum, "InstituteCourseId")

        const GetUpdatedInstituteCourse = await InstituteCourses.findOne({
            where: { cProudctInstituteId: req.body.cProudctInstituteId },
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

        res.status(200).json({ message: "Course Deleted Successfully", Success: true })
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}



export const GetSingleInstituteCourse = async (req, res) => {
    try {

        const InstituteCourse = await InstituteCourses.findOne({
            where: { InstituteCourseId: req.params.InstituteCourseId },
            attributes: { exclude: ["VehicleFK", "InstituteFK", "InstructorFK", "createdAt"] },
            include: Query
        })


        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while Getting single institute course: ${error.message}`);
        return res.status(500).json({ error });
    }
}

