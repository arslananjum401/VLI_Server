
import db from "../../Conn/connection.js";
import { CheckUUID } from "../../Helpers/CheckUUID.js";
import { ParseFAQs, StringifyFQAs } from "../../Helpers/DataParsersAndStringify.js";
import { DeleteFile } from "../../Helpers/DeleteMedia.js";

const { CProductToInstitute, Institute, Product, Course, InstituteCoursePackage, Instructor, Vehicle, User, CourseInstructors } = db;
const Query = [
    {
        model: Instructor, required: true,
        where: { Suspend: false },
        attributes: ["InstructorId", "PhoneNumber", "LicenseNumber"],
        include: { model: User, attributes: ["FirstName", "LastName"] }
    },
    { model: Vehicle, required: true, attributes: ["VehicleId", "ManufacturingCompany", "Model", "Year", "PlateNumber"] },
    { model: InstituteCoursePackage, required: true, attributes: ["IC_PackagesId", "DrivingHours", "InClassHours", "OnlineHours", "TotalFee"] },
    {
        model: Product, required: true, attributes: ["ProductId", "ProductName"],
        where: { ProductType: "Course" },
        include: [{ model: Course , attributes: ["CoursePK", "Description", "RunningCourse", "Promotion"]}]
    }
];

export const AddCourseToInstitute = async (req, res) => {
    req.body.Publish = false;
    if (!req.body.Packages) {
        return res.status(401).json({ message: "Curriculum is required" })
    }
    let a = req.body.Instructors
    try {
        const CheckInstituteCourse = await CProductToInstitute.findOne({
            where: {
                cPI_InstituteId: req.User.Institute.InstituteId,
                cPI_ProductId: req.body.ProductId
            },
        })

        if (CheckInstituteCourse) {
            return res.status(401).json({ message: "Course already addedd" });
        }
        if (!CheckUUID(req.body.ProductId)) {
            return res.status(200).json({ message: "Invalid UUID" })
        }

        delete req.body.Instructors;
        const GetProduct = await Product.findOne({ where: { ProductId: req.body.ProductId } })

        req.body.cPI_InstituteId = req.User.Institute.InstituteId;
        req.body.cPI_ProductId = GetProduct.ProductId;
        StringifyFQAs(req)
        const InstituteCourseCreated = await CProductToInstitute.create(req.body)
        await Promise.all(req.body.Packages.map(async (value) => {
            try {
                value.cPI_Id = InstituteCourseCreated.cProductInstituteId;
                await InstituteCoursePackage.create(value);
            } catch (error) {
                console.log(error)
            }
        }))
        a = a.map((value) => {
            value = { InstructorFK: value, CProductInstitutFK: InstituteCourseCreated.cProductInstituteId }
            return value
        })

        const AddInstructorsforCourse = await CourseInstructors.bulkCreate(a);





        const InstituteCourse = await CProductToInstitute.findOne({
            where: { cProductInstituteId: InstituteCourseCreated.cProductInstituteId },
            include: Query

        })
        console.log(InstituteCourse)
        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while adding course to Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}


export const RemoveCourseFromInstitute = async (req, res) => {
    try {
        const GetInstituteCourse = await CProductToInstitute.findOne({
            where: { cProudctInstituteId: req.body.cProudctInstituteId },
        })
        if (!GetInstituteCourse) {
            return res.status(404).json({ message: "Course not for Institute or has been deleted" })
        }
        const DeleteInstituteCourse = await CProductToInstitute.destroy({
            where: { cProudctInstituteId: GetInstituteCourse.cProudctInstituteId }
        }
        );
        DeleteFile(`${GetInstituteCourse.CourseCurriculum}`)
        await InstituteCoursePackage.destroy({ cPI_Id: GetInstituteCourse.cProudctInstituteId })

        res.status(200).json({ message: "Course Deleted Successfully", Success: true })
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}


export const GetInstituteCourses = async (req, res) => {
    try {
        const InstituteCourse = await CProductToInstitute.findAll({
            where: { cPI_InstituteId: req.User.Institute.InstituteId },
            attributes: { exclude: ["VehicleFK", "cPI_ProductId", "cPI_InstituteId", "InstructorFK", "createdAt"] },
            include: Query

        })
        ParseFAQs(InstituteCourse)
        res.status(200).json(InstituteCourse)
    } catch (error) {
        console.log(`error occurred while removing course from Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}



export const UpdateInstituteCourse = async (req, res) => {
    req.body.Publish = false
    try {
        const GetInstituteCourse = await CProductToInstitute.findOne({
            where: { cProudctInstituteId: req.body.cProudctInstituteId },
        })

        if (!GetInstituteCourse) {
            return res.status(404).json({ message: "Course not found or has been deleted" })
        }

        req.body.CourseCurriculum = req.body.UpdateCourseCurriculum
        const UpdateCourse = await CProductToInstitute.update(req.body, {
            where: { cProudctInstituteId: req.body.cProudctInstituteId }
        })

        if (req.body.UpdateCourseCurriculum) {
            DeleteFile(`${GetInstituteCourse.CourseCurriculum}`)
        }
        const GetUpdatedInstituteCourse = await CProductToInstitute.findOne({
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



export const GetInstituteCourse = async (req, res) => {
    try {

        if (req.params.Publish === "Publish")
            req.params.Publish = true;

        if (req.params.Publish === "UnPublish")
            req.params.Publish = false;

        const GetCourse = await Product.findAll({
            include: [
                {
                    model: Course,
                    attributes: ["CoursePK", "Description", "CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType", "CourseThumbnail"]
                },
                {
                    model: CProductToInstitute,
                    where: {
                        cPI_InstituteId: req.User.Institute.InstituteId,
                        Publish: req.params.Publish
                    },
                    attributes: ["ShortDescription", "LongDescription", "CourseCurriculum", "Possible_FAQs", "InstructorFK"],
                    required: true,
                    include: {
                        model: InstituteCoursePackage,
                        where: { Status: "Viewable" },
                        attributes: { exclude: ["cPI_Id", "Status", "createdAt"] }
                    }
                },
            ]
        })
        res.status(200).json(GetCourse)
    } catch (error) {
        console.log(`error occurred while Getting UnPublished course of Institute: ${error.message}`);
        return res.status(500).json({ error });
    }
}

