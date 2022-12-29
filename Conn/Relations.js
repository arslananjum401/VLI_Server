import db from './connection.js';
import { CourseEnrollmentRelations, CourseRelations, InstituteCourseRelations } from './Relations/CourseRelations.js';
const { Institute, Course, User, Instructor, Cart, Book, WishList, Product, LicenseTypes, Countries, VehicleTypes, CourseEnrollment, SubLicenseTypes, CoursePackages, InstituteCourses, Vehicle, VehicleImages, InstituteUser, UserEmailValidation, UserResetPassword, ForwardedCourse, BookReputationInfo, BoughtCourse, BoughtBook, CourseInstructors } = db;

function UserRelations() {
    Institute.hasOne(InstituteUser, { foreignKey: "InstituteFK" });
    InstituteUser.belongsTo(Institute, { foreignKey: "InstituteFK" });

    User.hasOne(InstituteUser, { foreignKey: "UserFK" });
    InstituteUser.belongsTo(User, { foreignKey: "UserFK" });

    //EmailValidation and User Relation 
    UserEmailValidation.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserEmailValidation, { foreignKey: "UserFK" })

    //ResetPassword and User Relation 
    UserResetPassword.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserResetPassword, { foreignKey: "UserFK" })


    User.hasOne(Instructor, { foreignKey: "UserFK" })
    Instructor.belongsTo(User, { foreignKey: "UserFK" })

}



export const Realtions = () => {
    //Institute and User Relation
    UserRelations()
    CourseRelations()
    InstituteCourseRelations(); 

    Institute.hasOne(ForwardedCourse, { foreignKey: "InstituteFK" });
    ForwardedCourse.belongsTo(Institute, { foreignKey: "InstituteFK" });
    User.hasOne(ForwardedCourse, { foreignKey: "UserFK" });
    ForwardedCourse.belongsTo(User, { foreignKey: "UserFK" });
    Product.hasOne(ForwardedCourse, { foreignKey: "ProductFK" });
    ForwardedCourse.belongsTo(Product, { foreignKey: "ProductFK" });


    Instructor.belongsToMany(InstituteCourses, { through: CourseInstructors, foreignKey: "InstructorFK" })
    InstituteCourses.belongsToMany(Instructor, { through: CourseInstructors, foreignKey: "InstituteCourseFK" })




    // Institute and Vehicle Relation   (one-to-many) 
    Institute.hasMany(Vehicle, { foreignKey: "InstituteFK" })



    BoughtCourse.belongsTo(CoursePackages, { foreignKey: "CoursePackagesFK" });
    CoursePackages.hasMany(BoughtCourse, { foreignKey: "CoursePackagesFK" });


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



    WishList.belongsTo(InstituteCourses, { foreignKey: "ProductFK" });
    InstituteCourses.hasMany(WishList, { foreignKey: "ProductFK" });
    
    WishList.belongsTo(User, { foreignKey: "StudentId" });
    User.hasMany(User, { foreignKey: "StudentId" });
    
    CourseEnrollmentRelations()
}

