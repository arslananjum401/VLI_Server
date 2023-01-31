import { MulterMiddleware } from "../MulterMiddleware.js";

export const MulterForAdmin = (req, res, next) => {
    let MulterVals = {};
    MulterVals.filepath = './Public/Book/CoverImage'
    MulterVals.UploadFields = [{ name: 'BookCover' }]

    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"

    MulterMiddleware(req, res, next, MulterVals)
}
export const MulterForCourseThumbnail = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/Course/Thumbnail'
    MulterVals.UploadFields = [{ name: 'CourseThumbnail' }];
    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"
    MulterMiddleware(req, res, next, MulterVals)
}
export const MulterForVehicleType = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/VehicleType'
    MulterVals.UploadFields = [{ name: 'VehicleTypeImage' }];
    MulterVals.filetypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"]

    MulterMiddleware(req, res, next, MulterVals)
}

export const MulterForLicenseType = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/LicenseType'
    MulterVals.UploadFields = [{ name: 'LicenseTypeImage' }];
    MulterVals.filetypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"]

    MulterMiddleware(req, res, next, MulterVals)
}