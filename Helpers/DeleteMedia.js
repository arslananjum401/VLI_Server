import fs from 'fs';
import path from 'path';
import { __dirname } from '../server.js';

export const DeleteFile = async (VehicleImagesModel, OldImageObj) => {
  try {
    let CheckDestruction
    if (OldImageObj) {
      CheckDestruction = await VehicleImagesModel.destroy({ where: { Vehicle_ImageId: OldImageObj.Vehicle_ImageId } })
    }
    let FilePath
    if (CheckDestruction) {
      FilePath = path.join(__dirname, OldImageObj.VehicleImageLink);
      fs.unlinkSync(FilePath)
    }

  } catch (error) {
    console.log(`Error occurred while Deleteing media`, error)
  }

}