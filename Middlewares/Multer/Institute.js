import { MulterMiddleware } from "./MulterMiddleware.js";

export const MulterForCourseCurriculum = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/Institute/Course/Curriculum'
    MulterVals.UploadFields = [{ name: "CourseCurriculum" }, { name: "UpdateCourseCurriculum" }];
    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"
    MulterMiddleware(req, res, next, MulterVals)
}
export const MulterForVehicleImages = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/Institute/Vehicle/VehicleImages'
    MulterVals.UploadFields = [{ name: "Image1" }, { name: "Image2" }, { name: "Image3" }, { name: "Image4" }, { name: "Image5" }, { name: "Image6" },
    { name: "UpdateImg1" }, { name: "UpdateImg2" }, { name: "UpdateImg3" }, { name: "UpdateImg4" }, { name: "UpdateIm5" }, { name: "UpdateImg6" }
    ];
    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"
    MulterMiddleware(req, res, next, MulterVals)
}
export const MulterFor_InstructorImages = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/Institute/Instructors'
    MulterVals.UploadFields = [{ name: "ProfileImage" }, { name: "LicenseImage" }, { name: "TrainerPermitImage" }, { name: "SpecialLicenseImage" },];
    MulterVals.filetypes = []
    MulterVals.filetypes[0] = "image/png"
    MulterVals.filetypes[1] = "image/jpg"
    MulterVals.filetypes[2] = "image/jpeg"
    MulterVals.filetypes[3] = "image/svg+xml"
    MulterMiddleware(req, res, next, MulterVals)
}


 