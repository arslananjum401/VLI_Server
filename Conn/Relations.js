import db from './connection.js';
const { Institute, Course, User, Instructor, Cart, Book, WishList, Product, LicenseTypes, Countries, VehicleTypes, CourseEnrollment, SubLicenseTypes, CoursePackages, InstituteCourses, Vehicle, VehicleImages, InstituteUser, UserEmailValidation, UserResetPassword, ForwardedCourse, BookReputationInfo, Bought, BoughtCourse, BoughtBook, CourseInstructors } = db;
export const Realtions = () => {
    //Institute and User Relation
    Institute.hasOne(InstituteUser, { foreignKey: "InstituteFK" });
    InstituteUser.belongsTo(Institute, { foreignKey: "InstituteFK" });
    User.hasOne(InstituteUser, { foreignKey: "Institute_UserFK" });
    InstituteUser.belongsTo(User, { foreignKey: "Institute_UserFK" });

    //EmailValidation and User Relation 
    UserEmailValidation.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserEmailValidation, { foreignKey: "UserFK" })

    //ResetPassword and User Relation 
    UserResetPassword.belongsTo(User, { foreignKey: "UserFK" })
    User.hasOne(UserResetPassword, { foreignKey: "UserFK" })



    Institute.hasOne(ForwardedCourse, { foreignKey: "InstituteFK" });
    ForwardedCourse.belongsTo(Institute, { foreignKey: "InstituteFK" });
    User.hasOne(ForwardedCourse, { foreignKey: "UserFK" });
    ForwardedCourse.belongsTo(User, { foreignKey: "UserFK" });
    Product.hasOne(ForwardedCourse, { foreignKey: "ProductFK" });
    ForwardedCourse.belongsTo(Product, { foreignKey: "ProductFK" });

    User.hasOne(Instructor, { foreignKey: "UserFK" })
    Instructor.belongsTo(User, { foreignKey: "UserFK" })

    Instructor.belongsToMany(InstituteCourses, { through: CourseInstructors, foreignKey: "InstructorFK" })
    InstituteCourses.belongsToMany(Instructor, { through: CourseInstructors, foreignKey: "InstituteCourseFK" })

    // Course and License Type Relation
    Course.belongsTo(LicenseTypes, { foreignKey: 'LicenseTypeFK' });

    // Course and Sub-License Type Relation
    Course.belongsTo(SubLicenseTypes, { foreignKey: 'SubLicenseTypeFK' });

    // Course and Vehicle Types Relation
    Course.belongsTo(VehicleTypes, { foreignKey: 'VehicleTypeFK' });


    // Countries and LicenseType Relation   (many-to-many)
    Countries.belongsToMany(LicenseTypes, { through: "CountryLicenseType", foreignKey: "CL_CountryId" });
    LicenseTypes.belongsToMany(Countries, { through: "CountryLicenseType", foreignKey: "CL_LicenseTypeId" });



    // Institute and Vehicle Relation   (one-to-many) 
    Institute.hasMany(Vehicle, { foreignKey: "InstituteFK" })



    Bought.belongsTo(User, { foreignKey: "UserFK" });

    BoughtCourse.belongsTo(Bought, { foreignKey: "BoughtFK" });
    Bought.hasOne(BoughtCourse, { foreignKey: "BoughtFK" });
    BoughtCourse.belongsTo(CoursePackages, { foreignKey: "CoursePackagesFK" });
    CoursePackages.hasMany(BoughtCourse, { foreignKey: "CoursePackagesFK" });


    BoughtBook.belongsTo(Bought, { foreignKey: "BoughtFK" });
    Bought.hasOne(BoughtBook, { foreignKey: "BoughtFK" });
    BoughtBook.belongsTo(Book, { foreignKey: "BookFK" });
    Book.hasOne(BoughtBook, { foreignKey: "BookFK" });

    // Institute and Product (Course) Relation when adding Institute will add course to Inventory

    // 1.Institute and InstituteCourses Relation (one-to-many)
    Institute.hasMany(InstituteCourses, { foreignKey: "InstituteFK" })
    InstituteCourses.belongsTo(Institute, { foreignKey: "InstituteFK" })

    // 2.Product and InstituteCourses Relation (one-to-many)
    Course.hasMany(InstituteCourses, { foreignKey: "CourseFK" });
    InstituteCourses.belongsTo(Product, { foreignKey: "CourseFK" })

    // 3.Vehicle and InstituteCourses Relation (one-to-many)
    Vehicle.hasMany(InstituteCourses, { foreignKey: "VehicleFK" })
    InstituteCourses.belongsTo(Vehicle, { foreignKey: "VehicleFK" })

    // 4.InstituteCourses and Course Packages Relation (one-to-many) 
    InstituteCourses.hasMany(CoursePackages, { foreignKey: "InstituteCourseFK" });
    CoursePackages.belongsTo(InstituteCourses, { foreignKey: "InstituteCourseFK" });

    Course.hasMany(InstituteCourses, { foreignKey: "CourseFK" })
    InstituteCourses.belongsTo(Course, { foreignKey: "CourseFK" })

    // Vehicle and Vehicle Images Relation (one-to-many)
    Vehicle.hasMany(VehicleImages, { foreignKey: "VehicleFK" })


    // Product and Book Relation (one-to-one)
    Book.belongsTo(Product, { foreignKey: 'ProductFK' });
    Product.hasOne(Book, { foreignKey: 'ProductFK' });


    // Book and BookReputation Info Relation
    BookReputationInfo.belongsTo(Book, { foreignKey: "BookFK" })
    Book.hasOne(BookReputationInfo, { foreignKey: "BookFK" });

    // LicenseTypes and Sub-LicenseTypes Relation (one-to-many)
    SubLicenseTypes.belongsTo(LicenseTypes, { foreignKey: "ParentLicenseTypeId", });
    LicenseTypes.hasMany(SubLicenseTypes, { foreignKey: "ParentLicenseTypeId", });

    // Instructor and Institute Relation (one-to-many)
    Instructor.belongsTo(Institute, { foreignKey: 'FromInstitute' });
    // Instructor and LicenseTypes Relation (one-to-many)
    Instructor.belongsTo(LicenseTypes, { foreignKey: 'Speciality' });




    // 
    Cart.belongsTo(User, { foreignKey: 'AddedById' });
    Cart.belongsTo(Product, { foreignKey: 'CartedProductId' });


    WishList.belongsTo(Product, { foreignKey: "WishedProduct" });
    WishList.belongsTo(User, { foreignKey: "StudentId" });

    CourseEnrollment.belongsTo(CoursePackages, { foreignKey: "CoursePackagesFK" });
    CoursePackages.hasOne(CourseEnrollment, { foreignKey: "CoursePackagesFK" });

    CourseEnrollment.belongsTo(User, { foreignKey: "UserFK" });
    User.hasOne(CourseEnrollment, { foreignKey: "UserFK" });


}  