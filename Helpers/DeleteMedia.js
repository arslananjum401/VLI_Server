import fs from 'fs';
import path from 'path';
import { __dirname } from '../app.js';

export const DeleteFile = async (ImagesModel, OldImageObj, ImagePath, PrimaryKey) => {
  try {
    let CheckDestruction

    if (OldImageObj && ImagesModel)
      CheckDestruction = await ImagesModel.destroy({ where: { [PrimaryKey]: OldImageObj[PrimaryKey] } })
    else
      CheckDestruction = true;

      
    let FilePath
    if (!ImagePath)
      ImagePath = OldImageObj.VehicleImageLink

    if (CheckDestruction) {
      FilePath = path.join(__dirname, ImagePath);
      fs.unlinkSync(FilePath)
    }

  } catch (error) {
    console.log(`Error occurred while Deleteing media`, error)
  }

}