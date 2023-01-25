import { Op } from 'sequelize';
import db from '../../Conn/connection.js';
import { ArrangeCourseObject } from '../../Helpers/ChangeObject.js';
import { Paginate } from '../../Helpers/Paginate.js';

const { Course, Product, LicenseTypes, VehicleTypes, SubLicenseTypes, CProductToInstitute, Institute } = db;
const CheckCourse = async (CourseName) => {

    let CourseGot = await Course.findOne({
        where: { CourseName: { [Op.iLike]: `%${CourseName}` } },
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

        if (req.body.PossibleKeywords) req.body.PossibleKeywords = JSON.stringify(req.body.PossibleKeywords)


        if (await CheckCourse(req.body.CourseName))
            return res.status(401).json({ message: "Course With same name already exists" });


        const newCourse = await Course.create(req.body);

        let CourseGot = await Course.findOne({
            where: { CoursePK: newCourse.CoursePK, Status: "Viewable" },
            attributes: { exclude: ["VehicleTypeFK", "LicenseTypeFK", "SubLicenseTypeFK"] },
            include: [
                { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"], },
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], },
            ]

        })

        res.status(201).json(CourseGot)

    } catch (errors) {
        console.log(`error occured while Creating Course ${errors}`);
        return res.status(500).json(errors);
    }
}



export const UpdateCourse = async (req, res) => {
    try {
        const CheckCourse = await Course.findOne({
            where: { CoursePK: req.body.CoursePK },
        });

        if (!CheckCourse) res.status(401).json({ message: "Course not found" })


        const UpdateCourse = await Course.update(req.body, { where: { CoursePK: req.body.CoursePK } });
        console.log(UpdateCourse)
        let CourseGot = await Course.findOne({
            where: { CoursePK: req.body.CoursePK, Status: "Viewable" },
            attributes: { exclude: ["VehicleTypeFK", "LicenseTypeFK", "SubLicenseTypeFK"] },

            include: [
                { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true, },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, },
            ]

        })

        res.status(201).json(CourseGot)

    } catch (errors) {
        console.log(`error occured while UpdateCourse ${errors}`);
        return res.status(500).json({ errors })
    }
}


export const GetCourse = async (req, res) => {

    try {
        let CourseGot = await Course.findOne({
            where: { CoursePK: req.params.CoursePK, Status: "Viewable" },
            attributes: { exclude: ["VehicleTypeFK", "LicenseTypeFK", "SubLicenseTypeFK"] },

            include: [
                { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true, },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, },
            ]

        })

        if (!CourseGot) return res.status(200).json({ message: "Course not found" });


        res.status(200).json(CourseGot);
    } catch (errors) {
        console.log(`error occured while getting Course ${errors}`);
        return res.status(500).json({ errors });
    }
}

export const GetAllCourses = async (req, res) => {
    try {
        const CourseGot = await Course.findAll({
            attributes: { exclude: ["VehicleTypeFK", "LicenseTypeFK", "SubLicenseTypeFK"] },
            order: [
                ['createdAt', 'ASC'],
            ],
            ...Paginate(req.body),
            include: [
                { model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] },
                { model: LicenseTypes, attributes: ["LicenseTypeName", "LicenseTypeId"], required: true, },
                { model: VehicleTypes, attributes: ["VehicleTypeName", "VehicleTypeId"], required: true, },
            ]
        })

        res.status(200).json(CourseGot);
    } catch (error) {
        console.log(`error occured while getting all Courses of Institute ${error}`);
        return res.status(500).json({ error });
    }


}

export const DeleteCourse = async (req, res) => {


    try {

        const FindCourse = await Course.findOne({
            where: { CoursePK: req.body.CoursePK, Status: "Viewable" }
        })

        if (!FindCourse) return res.status(404).json({ messsage: "Course not found" });

        if (FindCourse.ByInstitute !== req.User.InstituteId)
            return res.status(401).json({ messsage: "You cannot delete this course" });

        const DeletedCourse = await Course.update({ Status: 'Deleted' },
            {
                where: {
                    CoursePK: FindCourse.CoursePK
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