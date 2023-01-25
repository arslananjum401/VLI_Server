import { Op } from 'sequelize';
import db from "../../Conn/connection.js";
import { DeleteFile } from '../../Helpers/DeleteMedia.js';

const { Vehicle, VehicleImages } = db
export const AddVehicle = async (req, res) => {
    req.ImagesLink = []
    let regex = /image/i
    for (const key in req.body) {
        if (key.match(regex))
            req.ImagesLink.push(req.body[key])
    }

    req.body.InstituteFK = req.User.Institute.InstituteId;

    try {

        if (req.ImagesLink?.length <= 1 || !req.ImagesLink)
            return res.status(403).json({ message: "Images are required" })

        const CheckVehicle = await Vehicle.findOne({
            where: {
                [Op.or]: [
                    { IdentityNumber: req.body.IdentityNumber },
                    { PlateNumber: req.body.PlateNumber },
                    { InsuranceNumber: req.body.InsuranceNumber },
                    { TrainerNumberPlate: req.body.TrainerNumberPlate }
                ],

            },

        })
 
        if (CheckVehicle) {
            return res.status(403).json({ message: "Vehicle already registered" })
        }
        const AddNewVehicle = await Vehicle.create(req.body);

        await Promise.all(await req.ImagesLink.map(async (image, index, arr) => {
            try {
                if (index < arr.length - 1 && index > 0) {
                    console.log(image)
                    await VehicleImages.create({
                        VehicleFK: AddNewVehicle.VehicleId,
                        VehicleImageLink: image
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })
        )
        const GetNewVehicle = await Vehicle.findOne({
            where: { VehicleId: AddNewVehicle.VehicleId },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink"],
                where: { VehicleFK: AddNewVehicle.VehicleId },
            }]
        })
        res.status(200).json(GetNewVehicle)
    } catch (error) {
        console.log(`error occured while Adding Vehicle ${error.message}`);
        return res.status(500).json({ error });
    }
}


export const UpdateVehicle = async (req, res) => {

    req.body.InstituteFK = req.User.Institute.InstituteId
    try {

        if (!req.body.VehicleId)
            return res.status(401).json({ message: "VehicleId is required" })

        const CheckVehicle = await Vehicle.findOne({
            where: { VehicleId: req.body.VehicleId },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink"],
            }]
        })
        if (!CheckVehicle)
            return res.status(404).json({ message: "Vehicle not found" })



        const AddNewVehicle = await Vehicle.update(req.body, { where: { VehicleId: req.body.VehicleId } });


        //To update the Current Images
        if (req.body.UpdateImages) {
            await Promise.all(await req.body.UpdateImages.map(async (image, index, arr) => {
                try {
                    console.log(image.Vehicle_ImageId)
                    const FindOldImage = await VehicleImages.findOne({ where: { Vehicle_ImageId: image.Vehicle_ImageId } })// Get to get Old Image

                    DeleteFile(VehicleImages, FindOldImage)// To delete Old Image

                    if (req.body[image.Pair] && FindOldImage) {
                        const AddImage = await VehicleImages.create({ VehicleFK: FindOldImage.VehicleFK, VehicleImageLink: req.body[image.Pair] })
                        // console.log(AddImage)
                    }

                } catch (error) {
                    console.log(error)
                }
            }))
        }


        let Length = CheckVehicle.VehicleImages.length + req.body.NewImages.length

        //To add New Images
        if (Length < 6 && req.body.NewImages?.length > 0) {

            await req.body.NewImages.forEach(async (ImagePath) => {

                try {
                    // if (CheckVehicleImages.VehicleImages.length >= 6) {
                    //     return res.status(403).json({ message: "No more Images can be added" });

                    // }
                    const AddVehicleImages = await VehicleImages.create({
                        VehicleImageLink: ImagePath,
                        VehicleFK: req.body.VehicleId
                    },
                    );

                } catch (error) {
                    console.log(error)
                }

            })

        }



        // Get Updated Vehicle
        const GetNewVehicle = await Vehicle.findOne({
            where: { VehicleId: req.body.VehicleId },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink", "Vehicle_ImageId"],
            }]
        })
        res.status(200).json(GetNewVehicle)
    } catch (error) {
        console.log(`error occured while Updating Vehicle ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const RemoveVehicle = async (req, res) => {
    try {

        if (!req.body.VehicleId)
            return res.status(401).json({ message: "VehicleId is required" })

        const AddNewVehicle = await Vehicle.findOne({ where: { VehicleId: req.body.VehicleId } });
        if (!AddNewVehicle) {
            return res.status(401).json({ message: "Vehicle not found" })
        }

        const DeleteVehicle = await Vehicle.destroy({ where: { VehicleId: req.body.VehicleId } });
        const DeleteVehicleImages = await VehicleImages.destroy({ where: { VehicleFK: req.body.VehicleId } })
        res.status(200).json({ message: "Vehicle Removed Successfully" });
    } catch (error) {
        console.log(`error occured while Removing Vehicle ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const RemoveVehicleImage = async (req, res) => {
    try {
        if (!req.params.ImageId)
            return res.status(401).json({ message: "VehicleImageId is required" })

        const GetVehicleImage = await VehicleImages.findOne({ where: { Vehicle_ImageId: req.params.ImageId } });
        if (!GetVehicleImage) {
            return res.status(401).json({ message: "VehicleImage not found" })
        }

        DeleteFile(GetVehicleImage.VehicleImageLink)
        const DeleteVehicleImages = await VehicleImages.destroy({ where: { Vehicle_ImageId: GetVehicleImage.Vehicle_ImageId } })

        res.status(200).json({ message: "Vehicle Image Removed Successfully" });
    } catch (error) {
        console.log(`error occured while removing Vehicle Image ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetAllVehicles = async (req, res) => {
    try {

        const GetAllVehicles = await Vehicle.findAll({
            where: { InstituteFK: req.User.Institute.InstituteId },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink", "Vehicle_ImageId"],
            }]
        })
        res.status(200).json(GetAllVehicles);
    } catch (error) {
        console.log(`error occured while Getting all Vehicles of a Institute ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetSingleVehicle = async (req, res) => {
    try {
        const GetSingleVehicle = await Vehicle.findOne({
            where: { VehicleId: req.params.VehicleId },
            include: [{
                model: VehicleImages,
                attributes: ["VehicleImageLink", "Vehicle_ImageId"],
            }]
        })
        res.status(200).json(GetSingleVehicle);
    } catch (error) {
        console.log(`error occured while Getting single Vehicle of a Institute ${error.message}`);
        return res.status(500).json({ error });
    }
}


