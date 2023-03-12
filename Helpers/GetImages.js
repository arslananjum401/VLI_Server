import { __dirname } from "../app.js";
import path from 'path';
import fs from 'fs';
export const GetImage = async (req, res) => {
    try {
        req.query.url = req.query.url.replaceAll('"', '')

        const FilePath = path.join(__dirname, `./${req.query.url}`);


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
 