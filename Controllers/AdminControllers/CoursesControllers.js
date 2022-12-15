import { Op } from 'sequelize';
import db from '../../Conn/connection.js';
import { ArrangeCourseObject } from '../../Helpers/ChangeObject.js';
import { Paginate } from '../../Helpers/Paginate.js';

const { Course, Product, LicenseTypes, VehicleTypes, SubLicenseTypes, CProductToInstitute,Institute } = db;
const CheckCourse = async (CourseName) => {

    let CourseGot = await Product.findOne({
        where: { ProductName: { [Op.iLike]: `%${CourseName}` } },
        include: {
            model: Course, required: true,
            include: [
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true }
            ]
        }
    })
    if (CourseGot) {
        return true;
    }
    else {
        return false;
    }
}
export const NewCourse = async (req, res) => {
    try {
        req.body.ProductType = 'Course';
        req.body.PossibleKeywords = JSON.stringify(req.body.PossibleKeywords)
        const newCourse = await Course.create(req.body);
        req.body.CourseId = newCourse.CoursePK;

        if (await CheckCourse(req.body.ProductName)) {
            return res.status(401).json({ message: "Course With same name already exists" });
        }
        const NewProduct = await Product.create(req.body);
        const AddProductIdToCourse = Course.update(
            { CourseProductId: NewProduct.ProductId },
            { where: { CoursePK: newCourse.CoursePK } }
        );

        let CourseGot = await Product.findOne({
            where: {
                ProductId: NewProduct.ProductId,
                ProductType: "Course",
            },
            attributes: { exclude: ["ProductType"] },
            include: [{
                model: Course, required: true,
                where: { Status: "Viewable" },
                attributes: { exclude: ["CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType"] },
                include: [
                    { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                    { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true },
                    { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true }
                ]
            }

            ]
        })
        CourseGot = ArrangeCourseObject(CourseGot)

        // delete CourseGot.Course.CourseLicenseType; delete CourseGot.CourseId; delete CourseGot.BookId; delete CourseGot.Course.CourseProductId;


        res.status(201).json(CourseGot)
    } catch (errors) {
        console.log(`error occured while Creating Course ${errors}`);
        return res.status(500).json(errors);
    }
}



export const UpdateCourse = async (req, res) => {
    try {
        const CheckCourse = await Product.findOne({
            where: { ProductId: req.body.ProductId },
            include: { model: Course, required: true }
        });

        if (!CheckCourse) {
            res.status(401).json({ message: "Course not found" })
        }

        const UpdateProduct = await Product.update(req.body, { where: { ProductId: req.body.ProductId } });
        const UpdateCourse = await Course.update(req.body, { where: { CoursePK: CheckCourse.CourseId } });

        let CourseGot = await Product.findOne({
            where: {
                ProductId: req.body.ProductId,
                ProductType: "Course",

            },
            attributes: { exclude: ["ProductType"] },
            include: {
                where: { Status: "Viewable" },
                model: Course,
                required: true,
                attributes: { exclude: ["CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType"] },
                include: [
                    { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"], required: true },
                    { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true, },
                    { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, },
                ]

            }

        })

        CourseGot = ArrangeCourseObject(CourseGot)

        res.status(201).json(CourseGot)

    } catch (errors) {
        console.log(`error occured while UpdateCourse ${errors}`);
        return res.status(500).json({ errors })
    }
}


export const GetCourse = async (req, res) => {

    try {
        let CourseGot = await Product.findOne({
            where: {
                ProductId: req.params.ProductId,
                ProductType: "Course",

            },
            attributes: { exclude: ["ProductType"] },
            include:
                [{
                    model: Course,
                    where: { Status: "Viewable" },
                    attributes: { exclude: ["CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType"] },
                    required: true,
                    include: [
                        { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                        { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true },
                        { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, }
                    ]
                },
                {
                    model: CProductToInstitute,
                    include:{model:Institute}
                }
                ]
        })

        if (!CourseGot) {
            return res.status(200).json({ message: "Course not found" });
        }

        CourseGot = ArrangeCourseObject(CourseGot)

        res.status(200).json(CourseGot);
    } catch (errors) {
        console.log(`error occured while getting Course ${errors}`);
        return res.status(500).json({ errors });
    }
}

export const GetAllCourses = async (req, res) => {
    try {
        const CourseGot = await Product.findAll({
            where: { ProductType: "Course" },
            attributes: { exclude: ["ProductType"] },
            order: [
                ['createdAt', 'ASC'],
            ],
            ...Paginate(req.body),
            include:
            {
                model: Course,
                where: { Status: "Viewable" },
                attributes: { exclude: ["CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType"] },
                required: true,
                include: [
                    {
                        model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"],
                        // required: true 
                    },
                    { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true },
                    { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true }
                ]
            }
        })


        let ViewCourses = CourseGot.map((value) => ArrangeCourseObject(value));

        res.status(200).json(ViewCourses);
    } catch (error) {
        console.log(`error occured while getting all Courses of Institute ${error}`);
        return res.status(500).json({ error });
    }


}

export const DeleteCourse = async (req, res) => {


    try {

        const FindCourse = await Product.findOne(
            {
                where: {
                    ProductId: req.body.ProductId
                }
            }
        )
        // const DeleteCourset = await Course.destroy({ where: { CoursePK: FindCourse.CourseId } })
        // const DeleteProduct = await Product.destroy({ where: { ProductId: req.body.ProductId } })
        if (FindCourse.ByInstitute !== req.User.InstituteId) {
            return res.status(401).json({ messsage: "You cannot delete this course" });
        }
        const DeletedCourse = await Course.update({ Status: 'Deleted' },
            {
                where: {
                    CoursePK: FindCourse.CourseId
                }
            }
        )
        return res.status(200).json({ messsage: "Course Deleted Successfully" });
    } catch (error) {
        console.log(`error occured while DeleteCourse ${error}`);
        return res.status(500).json(error);
    }
}




export const GetCourseHistory = async (req, res) => {
    try {
        let CourseReport = await Product.findAll({
            include: [
                { model: LicenseTypes, attributes: ["LicenseTypeName"] },
                { model: Course }
            ]
        });
        CourseReport = CourseReport.map((value) => {

            value = ArrangeCourseObject(value)
            return value;
        })
        res.status(200).json(CourseReport)
    } catch (error) {
        console.log(error)
        console.log(`error occured while Getting Course Report: ${error}`);
        return res.status(500).json(error);
    }
}