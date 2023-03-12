import db from './connection.js';
import { CourseEnrollmentRelations, CourseRelations, InstituteCourseRelations } from './Relations/CourseRelations.js';
const { Institute, User, Instructor, Book, WishList, Product, LicenseTypes, SubLicenseTypes, CoursePackages, InstituteCourses, Vehicle, VehicleImages, InstituteUser, UserEmailValidation, UserResetPassword, ForwardedCourse, BoughtCourse, BoughtBook, CourseInstructors, StudentInfo, TimeTable, Notification, Course,Buying } = db;

function UserRelations() {
    Institute.hasOne(InstituteUser, { foreignKey: "InstituteFK" });
    InstituteUser.belongsTo(Institute, { foreignKey: "InstituteFK" });

    User.hasOne(InstituteUser, { foreignKey: "UserFK" });
    InstituteUser.belongsTo(User, { foreignKey: "UserFK" });


    User.hasOne(StudentInfo, { foreignKey: "UserFK" });
    StudentInfo.belongsTo(User, { foreignKey: "UserFK" });

    //EmailValidation and User Relation 
    UserEmailValidation.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserEmailValidation, { foreignKey: "UserFK" })

    //ResetPassword and User Relation 
    UserResetPassword.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserResetPassword, { foreignKey: "UserFK" })


    User.hasOne(Instructor, { foreignKey: "UserFK" })
    Instructor.belongsTo(User, { foreignKey: "UserFK" })


    User.hasMany(Notification, { foreignKey: "UserFK" })
    Notification.belongsTo(User, { foreignKey: "UserFK" })

}



export const Realtions = () => {
    //Institute and User Relation
    UserRelations()
    CourseRelations()
    InstituteCourseRelations();

    Institute.hasMany(ForwardedCourse, { foreignKey: "InstituteFK" });
    ForwardedCourse.belongsTo(Institute, { foreignKey: "InstituteFK" });



    ForwardedCourse.belongsTo(Course, { foreignKey: "CourseFK" });
    Course.hasMany(Course, { foreignKey: "CourseFK" });

 
    Instructor.belongsToMany(InstituteCourses, { through: CourseInstructors, foreignKey: "InstructorFK" })
    InstituteCourses.belongsToMany(Instructor, { through: CourseInstructors, foreignKey: "InstituteCourseFK" })




    // Institute and Vehicle Relation   (one-to-many) 
    Institute.hasMany(Vehicle, { foreignKey: "InstituteFK" })



    BoughtCourse.belongsTo(CoursePackages, { foreignKey: "CoursePackagesFK" });
    CoursePackages.hasMany(BoughtCourse, { foreignKey: "CoursePackagesFK" });
  
  
    BoughtCourse.belongsTo(Buying, { foreignKey: "BuyingFK" });
    Buying.hasOne(BoughtCourse, { foreignKey: "BuyingFK" });


    BoughtBook.belongsTo(Book, { foreignKey: "BookFK" });
    Book.hasOne(BoughtBook, { foreignKey: "BookFK" });

    // Institute and Product (Course) Relation when adding Institute will add course to Inventory


    // Vehicle and Vehicle Images Relation (one-to-many)
    Vehicle.hasMany(VehicleImages, { foreignKey: "VehicleFK" })
    VehicleImages.belongsTo(Vehicle, { foreignKey: "VehicleFK" })

    SubLicenseTypes.belongsTo(LicenseTypes, { foreignKey: "ParentLicenseTypeId", });
    LicenseTypes.hasMany(SubLicenseTypes, { foreignKey: "ParentLicenseTypeId", });

    // Instructor and Institute Relation (one-to-many)
    Instructor.belongsTo(Institute, { foreignKey: 'FromInstitute' });
    // Instructor and LicenseTypes Relation (one-to-many)
    Instructor.belongsTo(LicenseTypes, { foreignKey: 'Speciality' });
    LicenseTypes.hasMany(Instructor, { foreignKey: 'Speciality' });


    TimeTable.belongsTo(Instructor, { foreignKey: 'InstructorFK' });
    Instructor.hasOne(TimeTable, { foreignKey: 'InstructorFK' });



    WishList.belongsTo(InstituteCourses, { foreignKey: "ProductFK" });
    InstituteCourses.hasMany(WishList, { foreignKey: "ProductFK" });

    WishList.belongsTo(User, { foreignKey: "UserId" });

    CourseEnrollmentRelations()
}

