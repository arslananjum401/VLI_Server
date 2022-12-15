import db from '../../Conn/connection.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const { VehicleTypes } = db;

export const CreateVehicleType = async (req, res) => {
    try {
        req.body.Active = true;
        const CheckVehicleType = await VehicleTypes.findOne({ where: { VehicleTypeName: req.body.VehicleTypeName } })
        if (CheckVehicleType) {
            return res.status(401).json({ message: "Vehicle type already exists" })
        }
        const NewVehicleType = await VehicleTypes.create(req.body);
        res.status(200).json(NewVehicleType)
    } catch (error) {
        console.log(`error occurred while creating Vehicle type: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const UpdateVehicleType = async (req, res) => {
    try {
        const UpdatedVehicleType = await VehicleTypes.update(req.body, { where: { VehicleTypeId: req.body.VehicleTypeId } });
        const GetUpdatedVehicleType = await VehicleTypes.findOne({ where: { VehicleTypeId: req.body.VehicleTypeId } });
        res.status(200).json(GetUpdatedVehicleType)
    } catch (error) {
        console.log(`error occurred while Updating Vehicle type: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const DeleteVehicleType = async (req, res) => {
    try {
        req.body.Active = false;
        const DeletedVehicleType = await VehicleTypes.update(req.body, { where: { VehicleTypeId: req.body.VehicleTypeId } });
        res.status(200).json({ message: "Vehicle type deleted successfully" })
    } catch (error) {
        console.log(`error occurred while deleting Vehicle type: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const GetAllVehicleTypes = async (req, res) => {
    try {

        const GetVehicleTypes = await VehicleTypes.findAll();
        res.status(200).json(GetVehicleTypes);
    } catch (error) {
        console.log(`error occurred while getting All Vehicle types: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const GetVehicleTypesImage = async (req, res) => {
    try {
        req.query.url = req.query.url.replaceAll('"', '')
 
        const FilePath = path.join(__dirname, `../../${req.query.url}`);


        fs.readFile(FilePath, (err, success) => {
            try {
                if (err) {
                    console.log(err)
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
