import fs from 'fs';
import path from 'path';
import { __dirname } from '../server.js';

export const DeleteFile = (FilePathInDb) => {
  try {
    const FilePath = path.join(__dirname, FilePathInDb);

    fs.unlinkSync(FilePath)

  } catch (error) {
    console.log(`Error occurred while Deleteing media`, error)
  }

}