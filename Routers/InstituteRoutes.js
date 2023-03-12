import express from "express";
import { GetCourseHistory, } from '../Controllers/AdminControllers/CoursesControllers.js';
import { GetEnrolledCourseForInstitute, GetEnrolledStudentForInstitute, GetEnrolledStudents, GetEnrolledStudentForInstructor } from "../Controllers/Institute Controllers/EnrolledStudent.js";
import { AcceptForwardedCourse, ForwardCourseTostaff, GetAcceptedForwardedCourses, GetForwardedCourses, GetSingleForwardedCourse } from "../Controllers/Institute Controllers/ForwardCourse.js";
import { AddCourseToInstitute, GetInstituteCourses, RemoveCourseFromInstitute, UpdateInstituteCourse, GetSingleInstituteCourse, GetClassSchedule, CreateTimeTableByStaff } from "../Controllers/Institute Controllers/InstituteCourseControllers.js";
import { CreateInstructor, UpdateInstructor, DeleteInstructors, GetSingleInstructor, StudentReport, GetCourseReport, GetAvailableInstrutors, GetInstructorImage, GetAllInstructorsOfCourse, GetAllInstructorsOfInstitute } from "../Controllers/Institute Controllers/InstructorController.js";
import { AddStaff, DeleteStaffMemembers, GetAllStaffMemembers, GetSingleStaffMemember } from "../Controllers/Institute Controllers/StaffControllers.js";
import { AddVehicle, GetAllVehicles, GetSingleVehicle, RemoveVehicle, RemoveVehicleImage, UpdateVehicle, GetVehicleImage } from "../Controllers/Institute Controllers/VehicleControllers.js";
import { AuthenticatedUser, AuthenticateOptional } from "../Middlewares/Authentication/AuthenticateUser.js";
import { AuthenticateInstituteAdminUser, AuthenticateInstituteInstructorUser, AuthenticateInstituteStaffUser } from "../Middlewares/Authentication/Institute.js";
const Irouter = express.Router();
import { MulterForCourseCurriculum, MulterForVehicleImages, MulterFor_InstructorImages } from "../Middlewares/Multer/Institute.js";
import { DataParser } from "../Middlewares/ParseData.js";


// Instructor APIs 
Irouter
    .post('/Instructor/add', AuthenticatedUser, AuthenticateInstituteStaffUser, MulterFor_InstructorImages, DataParser, CreateInstructor)
    .put('/Instructor/update', AuthenticatedUser, AuthenticateInstituteStaffUser, UpdateInstructor)
    .delete('/Instructor/delete/:InstructorId', AuthenticatedUser, AuthenticateInstituteAdminUser, DeleteInstructors)
    .get('/SInstructor/:InstructorId', GetSingleInstructor)



    .get('/Instructors/:EnrollmentId', GetAllInstructorsOfCourse)
    .get('/Institute/Instructors', AuthenticatedUser, AuthenticateInstituteStaffUser, GetAllInstructorsOfInstitute)
    .get('/Instructors/available', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAvailableInstrutors)
    .get('/images/Instructors', GetInstructorImage)

// Forward Course APIs
Irouter
    .post('/course/forward', AuthenticatedUser, AuthenticateInstituteAdminUser, ForwardCourseTostaff)
    .get('/course/forwards', AuthenticatedUser, AuthenticateInstituteAdminUser, GetForwardedCourses)
    .get('/course/forward/:Status', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAcceptedForwardedCourses)
    .get('/course/sforward/:ForwardedCourseId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleForwardedCourse)


Irouter
    .get('/course/status/:Publish', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleInstituteCourse)
    .put('/course/response/:cProductInstituteId', AuthenticatedUser, AuthenticateInstituteAdminUser, AcceptForwardedCourse)



Irouter.get('/staff/course/forward', AuthenticatedUser, AuthenticateInstituteStaffUser, GetForwardedCourses)


// Edit Course for Inventory 
Irouter
    .post("/institute/course/add", AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForCourseCurriculum, DataParser, AddCourseToInstitute)
    .put("/institute/course/update", AuthenticatedUser, AuthenticateInstituteStaffUser, MulterForCourseCurriculum, DataParser, UpdateInstituteCourse)
    .delete("/institute/course/remove", AuthenticatedUser, AuthenticateInstituteStaffUser, RemoveCourseFromInstitute)
    .get("/institute/courses", AuthenticatedUser, GetInstituteCourses)
    // .get("/institute/courses", AuthenticatedUser, GetInstituteCourses)
    .get("/institute/course/:InstituteCourseId", AuthenticateOptional, GetSingleInstituteCourse)
    .get("/course/schedule/:EnrollmentId", GetClassSchedule)
    .post("/schedule/create", CreateTimeTableByStaff)

// .get("/institute/courses", AuthenticatedUser, AuthenticateInstituteAdminUser, GetInstituteCourses)

//  Staff APIs
Irouter
    .post('/Staff/add', AuthenticatedUser, AuthenticateInstituteAdminUser, AddStaff)
    .delete('/Staff/delete', AuthenticatedUser, AuthenticateInstituteAdminUser, DeleteStaffMemembers)
    .get('/Staff/:UserId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleStaffMemember)
    .get('/Staffs', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAllStaffMemembers)



// Vehicle APIs
Irouter
    .post('/Vehicle/add', AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForVehicleImages, DataParser, AddVehicle)
    .put('/Vehicle/update', AuthenticatedUser, AuthenticateInstituteAdminUser, MulterForVehicleImages, DataParser, UpdateVehicle)
    .delete('/Vehicle/remove', AuthenticatedUser, AuthenticateInstituteAdminUser, RemoveVehicle)
    .delete('/Vehicle/remove/:ImageId', AuthenticatedUser, AuthenticateInstituteAdminUser, RemoveVehicleImage)
    .get('/Vehicle/:VehicleId', AuthenticatedUser, AuthenticateInstituteAdminUser, GetSingleVehicle)
    .get('/Vehicleimage/', AuthenticatedUser, AuthenticateInstituteAdminUser, GetVehicleImage)
    .get('/Vehicles', AuthenticatedUser, AuthenticateInstituteAdminUser, GetAllVehicles)

Irouter
    .get('/Enrolled/students', AuthenticatedUser, AuthenticateInstituteStaffUser, GetEnrolledStudents)
    .get('/Enrolled/:EnrollmentId', AuthenticatedUser, AuthenticateInstituteInstructorUser, GetEnrolledCourseForInstitute)
    .get('/student/:EnrollmentId', AuthenticatedUser, AuthenticateInstituteInstructorUser, GetEnrolledStudentForInstitute)
    .get('/teacher/:InstructorId', AuthenticatedUser, AuthenticateInstituteInstructorUser, GetEnrolledStudentForInstructor)


Irouter
    .get('/Report/student', AuthenticatedUser, AuthenticateInstituteStaffUser, StudentReport)
    .get('/Report/course', AuthenticatedUser, AuthenticateInstituteStaffUser, GetCourseReport)
    .get('/hsitory/course', AuthenticatedUser, AuthenticateInstituteStaffUser, GetCourseHistory);

Irouter
    .post('timetable/add', AuthenticatedUser, AuthenticateInstituteStaffUser, GetCourseHistory)


export default Irouter;