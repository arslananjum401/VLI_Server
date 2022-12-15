import express from "express";
import { GetCourseHistory, } from '../Controllers/AdminControllers/CoursesControllers.js';
import { AcceptForwardedCourse, ForwardCourseTostaff, GetAcceptedForwardedCourses, GetForwardedCourses, GetSingleForwardedCourse } from "../Controllers/Institute Controllers/ForwardCourse.js";
import { AddCourseToInstitute, GetInstituteCourses, GetInstituteCourse, RemoveCourseFromInstitute, UpdateInstituteCourse } from "../Controllers/Institute Controllers/InstituteCourseControllers.js";
import { CreateInstructor, UpdateInstructor, GetAllInstructors, DeleteInstructors, GetSingleInstructor, StudentReport, GetCourseReport, GetAvailableInstrutors } from "../Controllers/Institute Controllers/InstructorController.js";
import { AddStaff, DeleteStaffMemembers, GetAllStaffMemembers, GetSingleStaffMemember } from "../Controllers/Institute Controllers/StaffControllers.js";
import { AddVehicle, GetAllVehicles, GetSingleVehicle, RemoveVehicle, RemoveVehicleImage, UpdateVehicle } from "../Controllers/Institute Controllers/VehicleControllers.js";
const Irouter = express.Router();
import { AuthenticatedUser, AuthenticateUserType } from "../Middlewares/AuthenticateUser.js";
import { MulterMiddleware } from "../Middlewares/MulterMiddleware.js";
import { DataParser } from "../Middlewares/ParseData.js";





const AuthenticateInstituteAdminUser = (req, res, next) => {
    console.log(req.User.User)
    AuthenticateUserType(req, res, next, "Institute", "Admin");
}
const AuthenticateInstituteStaffUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Institute", "Staff");
}
const AuthenticateInstituteInstructorUser = (req, res, next) => {
    AuthenticateUserType(req, res, next, "Institute", "Instructor");
}
const MulterForCourseCurriculum = (req, res, next) => {
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
const MulterForVehicleImages = (req, res, next) => {
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


// Instructor APIs
Irouter
    .post('/Instructor/create', AuthenticatedUser, AuthenticateInstituteAdminUser, CreateInstructor)
    .put('/Instructor/update', AuthenticatedUser, AuthenticateInstituteAdminUser, UpdateInstructor)
    .delete('/Instructor/delete/:InstructorId', AuthenticatedUser, AuthenticateInstituteAdminUser, DeleteInstructors)
    .get('/Instructor/:InstructorId', GetSingleInstructor)
    .get('/Instructors', GetAllInstructors)
    .get('/Instructors/available', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAvailableInstrutors)

// Forward Course APIs
Irouter
    .post('/course/forward', AuthenticatedUser, AuthenticateInstituteAdminUser, ForwardCourseTostaff)
    .get('/course/forwards', AuthenticatedUser, AuthenticateInstituteAdminUser, GetForwardedCourses)
    .get('/course/forward/:Status', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAcceptedForwardedCourses)
    .get('/course/sforward/:ForwardedCourseId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleForwardedCourse)


Irouter
    .get('/course/status/:Publish', AuthenticatedUser, AuthenticateInstituteAdminUser, GetInstituteCourse)
    .put('/course/response/:cProductInstituteId', AuthenticatedUser, AuthenticateInstituteAdminUser, AcceptForwardedCourse)





Irouter
    .get('/staff/course/forward', AuthenticatedUser, AuthenticateInstituteStaffUser, GetForwardedCourses)


// Edit Course for Inventory
Irouter
    .post("/course/institute/add", AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForCourseCurriculum, DataParser, AddCourseToInstitute)
    .put("/course/institute/update", AuthenticatedUser, AuthenticateInstituteStaffUser, MulterForCourseCurriculum, DataParser, UpdateInstituteCourse)
    .get("/course/institute/get", AuthenticatedUser, AuthenticateInstituteStaffUser, GetInstituteCourses)
    .delete("/course/institute/remove", AuthenticatedUser, AuthenticateInstituteStaffUser, RemoveCourseFromInstitute)

//  Staff APIs
Irouter
    .post('/Staff/add', AuthenticatedUser, AuthenticateInstituteAdminUser, AddStaff)
    .delete('/Staff/delete', AuthenticatedUser, AuthenticateInstituteAdminUser, DeleteStaffMemembers)
    .get('/Staff/:UserId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleStaffMemember)
    .get('/Staff', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAllStaffMemembers)



// Vehicle APIs
Irouter
    .post('/Vehicle/add', AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForVehicleImages, DataParser, AddVehicle)
    .put('/Vehicle/update', AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForVehicleImages, DataParser, UpdateVehicle)
    .delete('/Vehicle/remove', AuthenticatedUser, AuthenticateInstituteAdminUser, RemoveVehicle)
    .delete('/Vehicle/remove/:ImageId', AuthenticatedUser, AuthenticateInstituteAdminUser, RemoveVehicleImage)
    .get('/Vehicle/:VehicleId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleVehicle)
    .get('/Vehicles', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAllVehicles)

Irouter
    .get('/Report/student', AuthenticatedUser, AuthenticateInstituteStaffUser, StudentReport)
    .get('/Report/course', AuthenticatedUser, AuthenticateInstituteStaffUser, GetCourseReport)
    // .post('/Edit/name', AuthenticatedUser, GetAllInstructors);

    .get('/hsitory/course', AuthenticatedUser, AuthenticateInstituteStaffUser, GetCourseHistory)


export default Irouter;