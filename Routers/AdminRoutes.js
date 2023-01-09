import express from "express";
import { InstituteRequest, InstituteReqRes, AcceptedRequests, RejectedRequests, DownloadDocument, getAllInstitutes, getInstitute, CreateSubLicenseType, UpdateSubLicenseType, DeleteSubLicenseType, GetParentLicenseType, } from '../Controllers/AdminControllers/AdminControllers.js';
import { CreateBook, DeleteBook, GetAllBooks, GetSingleBook, UpdateBook } from "../Controllers/AdminControllers/BookControllers.js";
import { AddCountry, AddCountrysLicenseTypes, DeleteContryFromList, DeleteCountryLicenseType, GetCountriesList, GetSCountryWLicenseTypeList, UpdateCountry } from "../Controllers/AdminControllers/CountryControllers.js";
import { DeleteCourse, GetAllCourses, GetCourse, NewCourse, UpdateCourse } from "../Controllers/AdminControllers/CoursesControllers.js";
import { CreateLicenseType, DeleteLicenseType, GetAllLicenseTypeCourses, GetAllLicenseTypes, GetLicenseTypesImage, UpdateLicenseType } from "../Controllers/AdminControllers/LicenseType.js";
import { CreateVehicleType, DeleteVehicleType, GetAllVehicleTypeCourses, GetAllVehicleTypes, GetVehicleTypesImage, UpdateVehicleType } from "../Controllers/AdminControllers/VehicleType.js";
import { PaypalTransaction } from "../Controllers/Transaction.js";
import { AuthenticatedUser, AuthenticateUserType } from "../Middlewares/AuthenticateUser.js";
import { MulterMiddleware } from "../Middlewares/MulterMiddleware.js";
import { DataParser } from "../Middlewares/ParseData.js";

const AuthenticateAdminUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Admin", "Admin");
}



const Aroutes = express.Router();
const MulterForAdmin = (req, res, next) => {
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
const MulterForCourseThumbnail = (req, res, next) => {
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
const MulterForVehicleType = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/VehicleType'
    MulterVals.UploadFields = [{ name: 'VehicleTypeImage' }];
    MulterVals.filetypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"]

    MulterMiddleware(req, res, next, MulterVals)
}
const MulterForLicenseType = (req, res, next) => {
    let MulterVals = {};

    MulterVals.filepath = './Public/LicenseType'
    MulterVals.UploadFields = [{ name: 'LicenseTypeImage' }];
    MulterVals.filetypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"]

    MulterMiddleware(req, res, next, MulterVals)
}
const AuthenticateOptional = async (req, res, next) => {
    const { token } = await req.cookies;
    if (token)
        AuthenticatedUser(req, res, next)
    else
        next()
}

// Course APIs
Aroutes
    .post('/course/create', AuthenticatedUser, AuthenticateAdminUser, MulterForCourseThumbnail, DataParser, NewCourse)//done
    .put('/course/update', AuthenticatedUser, MulterForCourseThumbnail, DataParser, UpdateCourse)//done
    .delete('/course', AuthenticatedUser, AuthenticateAdminUser, DeleteCourse)//done
    .get('/course/:CoursePK', GetCourse)
    .get('/courses', GetAllCourses);


//  Countries APIs
Aroutes
    .post('/country/add', AuthenticatedUser, AuthenticateAdminUser, AddCountry)
    .put('/country/update', AuthenticatedUser, AuthenticateAdminUser, UpdateCountry)
    .delete('/country/delete', AuthenticatedUser, AuthenticateAdminUser, DeleteContryFromList)
    .get('/countries', AuthenticatedUser, AuthenticateAdminUser, GetCountriesList)


Aroutes
    .post('/country/licenseType/add', AuthenticatedUser, AuthenticateAdminUser, AddCountrysLicenseTypes)
    .delete('/country/licenseType/delete', AuthenticatedUser, AuthenticateAdminUser, DeleteCountryLicenseType)
    .get('/country/:CountryPk', GetSCountryWLicenseTypeList)


// Institute APIs
Aroutes
    .get('/InstitutesRequest', AuthenticatedUser, AuthenticateAdminUser, InstituteRequest)//Checked
    .put('/InstitutesRequest/res', AuthenticatedUser, AuthenticateAdminUser, InstituteReqRes)//Checked
    .get('/InstitutesRequest/accepted', AuthenticatedUser, AuthenticateAdminUser, AcceptedRequests)//Checked
    .get('/InstitutesRequest/rejected', AuthenticatedUser, AuthenticateAdminUser, RejectedRequests)//Checked
    .get('/download', DownloadDocument)//Checked


Aroutes
    .get('/AllInstitutes', AuthenticatedUser, AuthenticateAdminUser, getAllInstitutes)//Checked
    .get('/Institute/:InstituteUserId', AuthenticatedUser, AuthenticateAdminUser, getInstitute)//Checked


//  LicenseType APIs
Aroutes
    .post('/LicenseType/create', AuthenticatedUser, AuthenticateAdminUser, MulterForLicenseType, DataParser, CreateLicenseType)//Checked
    .put('/LicenseType/update', AuthenticatedUser, AuthenticateAdminUser, MulterForLicenseType, DataParser, UpdateLicenseType)//Checked
    .delete('/LicenseType/delete', AuthenticatedUser, AuthenticateAdminUser, DeleteLicenseType)//Checked
    .get('/LicenseTypes', GetAllLicenseTypes)//Checked
    .get('/LicenseType/courses/:LicenseTypeId', AuthenticateOptional, GetAllLicenseTypeCourses)
    .get('/LicenseType/image', GetLicenseTypesImage)

//  SubLicenseType APIs
Aroutes
    .post('/subLicenseType/create', AuthenticatedUser, AuthenticateAdminUser, MulterForLicenseType, DataParser, CreateSubLicenseType)//Checked
    .put('/subLicenseType/update', AuthenticatedUser, AuthenticateAdminUser, MulterForLicenseType, DataParser, UpdateSubLicenseType)//Checked
    .delete('/subLicenseType/delete', AuthenticatedUser, AuthenticateAdminUser, DeleteSubLicenseType)//Checked
    .get('/subLicenseType/parent', AuthenticatedUser, AuthenticateAdminUser, GetParentLicenseType)//Checked


//  VehicleType APIs
Aroutes
    .post('/VehicleType/create', AuthenticatedUser, AuthenticateAdminUser, MulterForVehicleType, DataParser, CreateVehicleType)
    .put('/VehicleType/update', AuthenticatedUser, AuthenticateAdminUser, MulterForVehicleType, DataParser, UpdateVehicleType)
    .delete('/VehicleType/delete', AuthenticatedUser, AuthenticateAdminUser, DeleteVehicleType)
    .get('/AllVehicleTypes', GetAllVehicleTypes)
    .get('/vehicletype/courses/:VehicleTypeId', AuthenticateOptional, GetAllVehicleTypeCourses)
    .get('/vehicletype/image', GetVehicleTypesImage)//Checked


// Book APIs
Aroutes
    .post('/Book/Create', AuthenticatedUser, AuthenticateAdminUser, MulterForAdmin, DataParser, CreateBook)//Checked
    .put('/Book/update/:ProductId', AuthenticatedUser, AuthenticateAdminUser, UpdateBook)//Checked
    .delete('/Book/delete/:ProductId', AuthenticatedUser, AuthenticateAdminUser, DeleteBook)//Checked
    .get('/Books', AuthenticatedUser, AuthenticateAdminUser, GetAllBooks)//Checked
    .get('/Book/:ProductId', AuthenticatedUser, AuthenticateAdminUser, GetSingleBook)//Checked

Aroutes.get('/paypal', AuthenticatedUser, AuthenticateAdminUser, PaypalTransaction)

export default Aroutes;




// req.query.url = req.query.url.replaceAll('"', '')

// const FilePath = path.join(__dirname, `../../${req.query.url}`)
// console.log(FilePath)
// const stream = fs.createReadStream(FilePath);
// // res.set({ 'Content-Type': 'image/png' });



// // fs.access(FilePath, function (exist) {
// //     console.log(exist)
// //     if(!exist) {
// //       // if the file is not found, return 404
// //       res.statusCode = 404;
// //     //   res.end(`File ${pathname} not found!`);
// //       return;
// //     }

// //   });
// // console.log(path.join(__dirname, `../../${req.query.url}`))
// res.set({ 'Content-Type': 'image/png' });
// res.status(200).sendFile(FilePath);