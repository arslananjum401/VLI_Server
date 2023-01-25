
import { request } from "express";
import { Op } from "sequelize";
import db from "../../Conn/connection.js"
import { CheckUUID } from "../../Helpers/CheckUUID.js";
const { Countries, LicenseTypes, CountryLicenseType } = db
export const AddCountry = async (req, res) => {
    try {

        req.body.Active = true;
        const CheckCountry = await Countries.findOne({
            where: {
                CountryName: { [Op.iLike]: `%${req.body.CountryName}` },
                Active: req.body.Active,
            }
        });

        if (CheckCountry) {
            return res.status(401).json({ message: "Country already added" });
        }
        const NewCountry = await Countries.create(req.body);
        delete NewCountry.dataValues.Active;
        res.status(201).json(NewCountry);
    } catch (error) {
        console.log(`Error occurred while creating new country: ${error.message}`);
        res.status(500).json(error)
    }
}

export const UpdateCountry = async (req, res) => {
    try {
        if (!req.body.CountryPk) {
            return res.status(401).json({ message: "CountryPK is required" });
        }
        const UpdateCountry = await Countries.update(req.body,
            { where: { CountryPk: req.body.CountryPk } });

        if (UpdateCountry.length <= 0) {
            return res.status(401).json({ message: "Country not found" });
        }
        const GetCountry = await Countries.findOne({ where: { CountryPk: req.body.CountryPk }, attributes: { exclude: ["Active"] } })
        res.status(200).json(GetCountry)
    } catch (error) {
        console.log(`Error occurred while Updating country: ${error.message}`);
        res.status(500).json(error)
    }
}


export const DeleteContryFromList = async (req, res) => {
    try {
        req.body.Active = false;
        const DeleteCountry = await Countries.update(req.body, {
            where: { CountryPk: req.body.CountryPk }
        });
        if (DeleteCountry.length <= 0) {
            return res.status(401).json({ message: "Country not found" });
        }
        const GetCountry = await Countries.findOne({ where: { CountryPk: req.body.CountryPk }, attributes: { exclude: ["Active"] } })
        res.status(200).json(GetCountry)
    } catch (error) {
        console.log(`Error occurred while Deleting country from list: ${error.message}`);
        res.status(500).json(error)
    }
}

export const GetCountriesList = async (req, res) => {
    try {
        const GetCountry = await Countries.findAll({ attributes: { exclude: ["Active"] } })
        res.status(200).json(GetCountry)
    } catch (error) {
        console.log(`Error occurred while Getting country from list: ${error.message}`);
        res.status(500).json(error)
    }
}
export const GetSCountryWLicenseTypeList = async (req, res) => {
    try {
        if (!CheckUUID(req.params.CountryPk)) {
            return res.status(401).json({ message: "Invalid Id" })
        }
        let GetCountryLicenses = await Countries.findOne({
            where: { CountryPk: req.params.CountryPk }, attributes: { exclude: ["Active"] },
            include: {
                model: LicenseTypes, attributes: { exclude: ["CountryLicenseType", "Active"] }
            }
        })
        GetCountryLicenses = GetCountryLicenses.dataValues
        GetCountryLicenses.LicenseTypes = GetCountryLicenses.LicenseTypes.map((value) => {
            delete value.dataValues.CountryLicenseType;
            return value
        })

        res.status(200).json(GetCountryLicenses)
    } catch (error) {
        console.log(`Error occurred while Getting country from list: ${error.message}`);
        res.status(500).json(error)
    }
}


export const AddCountrysLicenseTypes = async (req, res) => {
    try {
        let CheckError = { is: false, message: "" }
        const GetCountry = await Countries.findOne({ where: { CountryPk: req.body.CountryPk }, attributes: { exclude: ["Active"] } });

        await req.body.LicenseTypeId.forEach(async (value) => {
            try {
                if (!CheckUUID(req.body.CountryPk) || !CheckUUID(value)) {
                    CheckError.is = true;
                    CheckError.message = "Invalid ID"
                    throw new Error("Invalid ID")
                }
                const CheckCountryLicenses = await Countries.findOne({
                    where: { CountryPk: req.body.CountryPk },
                    attributes: { exclude: ["Active", "createdAt"] },
                    include: {
                        model: LicenseTypes, attributes: { exclude: ["CountryLicenseType", "Active"] },
                        where: { LicenseTypeId: value }, required: true
                    }
                })
                if (!CheckCountryLicenses) {
                    const GetLicenseType = await LicenseTypes.findOne({ where: { LicenseTypeId: value }, });
                    const Result = await GetCountry.addLicenseTypes(GetLicenseType, { through: "CountryLicenseType" });
                }
            } catch (error) {
                console.log(`Error occurred while adding Category to the country iterating: ${error.message}`);
            }
        })
        if (CheckError.is) {
            return res.status(401).json({ message: CheckError.message })
        }
        let GetCountryLicenses = await Countries.findOne({
            where: { CountryPk: req.body.CountryPk },
            attributes: { exclude: ["Active", "createdAt"] },
            include: {
                model: LicenseTypes, attributes: { exclude: ["CountryLicenseType", "Active"] }
            }
        })

        GetCountryLicenses = GetCountryLicenses.dataValues
        GetCountryLicenses.LicenseTypes = GetCountryLicenses.LicenseTypes.map((value) => {
            delete value.dataValues.CountryLicenseType;
            return value
        })


        res.status(200).json(GetCountryLicenses)
    } catch (error) {
        console.log(`Error occurred while adding Category to the country: ${error.message}`);
        res.status(500).json(error)
    }
}


export const DeleteCountryLicenseType = async (req, res) => {
    try {
        let CheckCountryLicenses = await CountryLicenseType.findOne({
            where: {
                CL_CountryId: req.body.CountryPk,
                CL_LicenseTypeId: req.body.LicenseTypeId
            }
        })
        if (!CheckCountryLicenses) {
            return res.status(404).json({ message: "License type not found for country or has been removed", success: false })
        }
        if (!CheckUUID(req.body.CountryPk) || !CheckUUID(req.body.LicenseTypeId)) {
            return res.status(401).json({ message: "Invalid UUID" })
        }
        const RemoveCountry = await CountryLicenseType.destroy({
            where: {
                CL_CountryId: req.body.CountryPk,
                CL_LicenseTypeId: req.body.LicenseTypeId
            }
        })



        let GetCountryLicenses = await Countries.findOne({
            where: { CountryPk: req.body.CountryPk },
            attributes: { exclude: ["Active", "createdAt"] },
            include: {
                model: LicenseTypes, attributes: { exclude: ["CountryLicenseType", "Active"] }
            }
        })
        GetCountryLicenses = GetCountryLicenses.dataValues
        GetCountryLicenses.LicenseTypes = GetCountryLicenses.LicenseTypes.map((value) => {
            delete value.dataValues.CountryLicenseType;
            return value
        })
        res.status(200).json(GetCountryLicenses)
    } catch (error) {
        console.log(`Error occurred while deleting Category from the country: ${error.message}`);
        res.status(500).json(error)
    }
}