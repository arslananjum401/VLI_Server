import db from '../../Conn/connection.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const { LicenseTypes, SubLicenseTypes, Course, InstituteCourses, CoursePackages, Institute, WishList } = db;


export const CreateLicenseType = async (req, res) => {
    req.body.Active = true
    try {

        const FindLicenseType = await LicenseTypes.findOne({
            where: {
                LicenseTypeName: req.body.LicenseTypeName
            }
        })


        if (FindLicenseType) {
            return res.status(409).json({ message: "LicenseType name already exist. Choose a different name" });
        }


        const NewLicenseType = await LicenseTypes.create(req.body);
        res.status(200).json(NewLicenseType);
    } catch (error) {
        console.log(`error occurred while Creating LicenseType: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const UpdateLicenseType = async (req, res) => {
    try {

        const NewLicenseType = await LicenseTypes.update(req.body, {
            where: {
                LicenseTypeId: req.body.LicenseTypeId
            }
        });
        res.status(200).json(NewLicenseType);
    } catch (error) {
        console.log(`error occurred while Updating LicenseType: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const DeleteLicenseType = async (req, res) => {
    req.body.Active = false;
    try {
        console.log("deleted")
        const DeleteLicenseType = await LicenseTypes.update(req.body, {
            where: {
                LicenseTypeId: req.body.LicenseTypeId
            },

        });
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        console.log(`error occurred while Deleting LicenseType: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const GetAllLicenseTypes = async (req, res) => {
    try {

        const AllCatgories = await LicenseTypes.findAll({
            where: {
                Active: true,
            },
            attributes: { exclude: ["Active", "SubLicenseType"] },
            include: [{
                model: SubLicenseTypes,

                attributes: ["SubLicenseTypeName", "SubLicenseTypeId"]
            }]
        });

        res.status(200).json(AllCatgories);
    } catch (error) {
        console.log(`error occurred while getting All LicenseTypes: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const GetAllLicenseTypeCourses = async (req, res) => {

    let IncludeQuery = {
        include: {
            model: Course,
            attributes: ["CourseName", "Description", "CourseThumbnail"], required: true,
            include: {

                model: InstituteCourses,
                attributes: ["InstituteCourseId", "ShortDescription"],
                required: true,
                include: [
                    { model: CoursePackages, attributes: ["CoursePackageId", "TotalFee", "InstallmentSchedule"], required: true },

                    { model: Institute, attributes: ["InstituteName", "InstituteId", "Country", "State", "City"], required: true },
                ]
            }
        },
        order: []
    }

    try {
        const GetLicenseTypes = await LicenseTypes.findOne({
            where: {
                Active: true,
                LicenseTypeId: req.params.LicenseTypeId
            },
            include: {
                model: SubLicenseTypes,
            }
        })
        if (!GetLicenseTypes)
            return res.status(401).json({ message: "Not found" })

        if (req.UserId) {
            let Wish = {
                model: WishList, attributes: ["WishId", "StudentId"],
                where: { StudentId: req.UserId },
                required: false
            }
            IncludeQuery?.include?.include?.include.push(Wish)
        }

        let Obj = {};
        if (GetLicenseTypes.SubLicenseTypes.length > 0) {
            Obj = {
                include: {
                    model: SubLicenseTypes
                }
            }
            Object.assign(IncludeQuery, Obj)
        } else {
            Obj = IncludeQuery;
        }


        let AllCatgories = await LicenseTypes.findOne({
            where: {
                Active: true,
                LicenseTypeId: req.params.LicenseTypeId
            },
            attributes: { exclude: ["Active", "SubLicenseType"] },
            ...Obj
        });

        res.status(200).json(AllCatgories);
    } catch (error) {
        console.log(`error occurred while getting All LicenseTypes: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const LicenseTypeInfo = async (req, res) => {
    try {

        const SLicenseTypeInfo = await LicenseTypes.findOne({
            where: { LicenseTypeId: req.params.LicenseTypeId },
            attributes: ["LicenseTypeId", "LicenseTypeName"],
            include: [{ model: SubLicenseTypes, attributes: ["SubLicenseTypeName", "SubLicenseTypeId"] }]
        })
        res.status(200).json(SLicenseTypeInfo);
    } catch (error) {
        console.log(`error occurred while getting Single LicenseType: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const GetLicenseTypesImage = async (req, res) => {
    try {
        req.query.url = req.query.url.replaceAll('"', '')

        const FilePath = path.join(__dirname, `../../${req.query.url}`);

        fs.readFile(FilePath, (err, success) => {

            try {
                if (err) {
                    return res.status(404).json("file not found")
                }

                res.set({ 'Content-Type': 'image/png' });
                res.status(200).send(success)
            } catch (error) {
                console.log(`error occurred while getting sending vehicle type fs image: ${error}`);
                return res.status(500).json({ error: error.message });
            }

        })
    } catch (error) {
        console.log(`error occurred while getting  Vehicle types image: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
