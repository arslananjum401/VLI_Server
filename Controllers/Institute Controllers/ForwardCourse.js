import { response } from 'express';
import { Op } from 'sequelize';
import db from '../../Conn/connection.js'
const { Course, Product, LicenseTypes, ForwardedCourse, CProductToInstitute,InstituteCoursePackage } = db;

const Query = {
    attributes: ["ForwardedCourseId", "ForwardedCourseNotes", "Status"],
    include: [{
        model: Product,
        attributes: { exclude: ["BookId", "createdAt"] },
        include: {
            model: Course,
            attributes: { exclude: ["RunningCourse", "Promotion", "Completed", "Cancel", "Status", "createdAt", "BookId"] },
            include: { model: LicenseTypes, attributes: ["LicenseTypeId", "LicenseTypeName"] }
        }
    }]
}
Op
export const ForwardCourseTostaff = async (req, res) => {
    try {
        const FindForwardedCourse = await ForwardedCourse.findOne({
            where: {
                ProductFK: req.body.ProductFK,
                InstituteFK: req.User.Institute.InstituteId
            }
        })
        if (FindForwardedCourse) {
            return res.status(200).json({ message: "Course Already Forwarded" })
        }
        req.body.ForwardedCourseNotes = JSON.stringify(req.body.ForwardedCourseNotes)
        req.body.InstituteFK = req.User.Institute.InstituteId
        req.body.UserFK = req.UserId
        const SentCourse = await ForwardedCourse.create(req.body);

        const GetForwardedCourse = await ForwardedCourse.findOne({
            where: { ForwardedCourseId: SentCourse.ForwardedCourseId },
            ...Query
        })
        GetForwardedCourse.dataValues.ForwardedCourseNotes = JSON.parse(GetForwardedCourse.dataValues.ForwardedCourseNotes)
        res.status(200).json(GetForwardedCourse)
    } catch (error) {
        console.log(`Error occurred while forwarding course:${error}`)
        res.status(500).json(error)
    }
}

export const AcceptForwardedCourse = async (req, res) => {
    try {

        req.params.cProductInstituteId;


        const GetCourse = await CProductToInstitute.findOne({ where: { 
            cProductInstituteId: req.params.cProductInstituteId,
            cPI_InstituteId:req.User.Institute.InstituteId
         } });

        if (!GetCourse)
            return res.status(404).json({ message: "Course not found or has been deleted" });

        const UpdateCourse = CProductToInstitute.update(req.body, { where: { 
            cProductInstituteId: req.params.cProductInstituteId,
            cPI_InstituteId:req.User.Institute.InstituteId
        } });
        const GetUpdatedCourse = await Product.findOne({
            include: [
                {
                    model: Course,
                    attributes: ["CoursePK", "Description", "CourseVehicleType", "CourseLicenseType", "CourseSubLicenseType", "CourseThumbnail"]
                },
                {
                    model: CProductToInstitute,
                    where: {
                        cProductInstituteId: req.params.cProductInstituteId,
                        cPI_InstituteId:req.User.Institute.InstituteId,
                        Publish: true
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
        res.status(200).json(GetUpdatedCourse)
    } catch (error) {
        console.log(`Error occurred while accepting forwarded course:${error}`)
        res.status(500).json(error)
    }
}


export const GetForwardedCourses = async (req, res) => {
    try {
        const GetCourseEditedByStaff = await ForwardedCourse.findAll({
            where: {
                InstituteFK: req.User.Institute.InstituteId,
                // Publish: false,
            }
        })
        

        if (GetCourseEditedByStaff.length <= 0) {
            return res.status(404).json({ message: "Nothing found" })
        }
        let FindCourseForwarded = await ForwardedCourse.findAll({
            where: {
                Status: "Working"
            },
            ...Query
        });
        // FindCourseForwarded = FindCourseForwarded.map(value => {
        //     value.dataValues.ForwardedCourseNotes = JSON.parse(value.dataValues.ForwardedCourseNotes)
        //     return value
        // })
        res.status(200).json(FindCourseForwarded);
    } catch (error) {
        console.log(`Error occurred while Getting forwarded course:${error}`)
        res.status(500).json(error)
    }
}
export const GetAcceptedForwardedCourses = async (req, res) => {
    try {
        if (req.params.Status !== "Accepted" && req.params.Status !== "Rejected") {
            return res.status(401).json({ message: "Invalid Query" })
        }
        let FindAcceptedCourseForwarded = await ForwardedCourse.findAll({
            where: {
                Status: req.params.Status
            },
            ...Query
        });
        FindAcceptedCourseForwarded = FindAcceptedCourseForwarded.map(value => {
            value.dataValues.ForwardedCourseNotes = JSON.parse(value.dataValues.ForwardedCourseNotes)
            return value
        })

        res.status(200).json(FindAcceptedCourseForwarded);
    } catch (error) {
        console.log(`Error occurred while Getting forwarded course:${error}`)
        res.status(500).json(error)
    }
}

export const GetSingleForwardedCourse = async (req, res) => {
    try {
        const FindSingleCourseForwarded = await ForwardedCourse.findOne({
            where: {
                ForwardedCourseId: req.params.ForwardedCourseId,
            },
            ...Query
        });
        if (!FindSingleCourseForwarded) {
            return res.status(404).json({ message: "Forwarded Course Not found" })
        }

        FindSingleCourseForwarded.dataValues.ForwardedCourseNotes = JSON.parse(FindSingleCourseForwarded.dataValues.ForwardedCourseNotes)
        return res.status(200).json(FindSingleCourseForwarded)
    } catch (error) {
        console.log(`Error occurred while Getting Single forwarded course:${error}`)
        res.status(500).json(error)
    }
}