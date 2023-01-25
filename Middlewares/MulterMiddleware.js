import multer from 'multer'

export const MulterMiddleware = async (req, res, next, MulterVals) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, MulterVals.filepath)
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + file.originalname)
            }
        })

        const fileFilter = (req, file, cb) => {
            if (
                file.mimetype == MulterVals.filetypes[0] ||
                file.mimetype == MulterVals.filetypes[1] ||
                file.mimetype == MulterVals.filetypes[2] ||
                file.mimetype == MulterVals.filetypes[3]
            ) {
                cb(null, true);
            } else {
                cb(null, false);
                // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }




        const upload = multer({ fileFilter, storage })
        // MulterVals.UploadFields
        const cpUpload = upload.fields(MulterVals.UploadFields);
        cpUpload(req,res,(err)=>{
            if (err) {
                console.log(err)
            }
            else{
                next()
            }
        })

    } catch (error) {
        console.log(`Error occurred while uploading files via multer: ${error.message}`);
        res.status(200).json(error)
    }
}