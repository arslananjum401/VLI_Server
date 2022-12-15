import db from './connection.js';
const { Institute, Course, User, Instructor, Cart, Book, WishList, Product, LicenseTypes, Countries, VehicleTypes, CourseEnrollment, SubLicenseTypes, InstituteCoursePackage: CoursePackage, CProductToInstitute, Vehicle, VehicleImages, InstituteUser, UserEmailValidation, UserResetPassword, ForwardedCourse, BookReputationInfo, Bought, BoughtCourse, BoughtBook, CourseInstructors } = db;
export const Realtions = () => {
    //Institute and User Relation
    Institute.hasOne(InstituteUser, { foreignKey: "InstituteFK" });
    InstituteUser.belongsTo(Institute, { foreignKey: "InstituteFK" });
    User.hasOne(InstituteUser, { foreignKey: "Institute_UserFK" })
    InstituteUser.belongsTo(User, { foreignKey: "Institute_UserFK" })





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


    Instructor.belongsToMany(CProductToInstitute, { through: CourseInstructors, foreignKey: "InstructorFK" })
    CProductToInstitute.belongsToMany(Instructor, { through: CourseInstructors, foreignKey: "CProductInstitutFK" })

    // Course and Product Relation
    Course.belongsTo(Product, { foreignKey: 'CourseProductId' });
    Product.hasOne(Course, { foreignKey: 'CourseProductId' });
    // Product.belongsTo(LicenseTypes, { foreignKey: 'ProductLicenseTypeId' });

    // Course and License Type Relation
    Course.belongsTo(LicenseTypes, { foreignKey: 'CourseLicenseType' });

    // Course and Sub-License Type Relation
    Course.belongsTo(SubLicenseTypes, { foreignKey: 'CourseSubLicenseType' });

    // Course and Vehicle Types Relation
    Course.belongsTo(VehicleTypes, { foreignKey: 'CourseVehicleType' });


    // Countries and LicenseType Relation   (many-to-many)
    Countries.belongsToMany(LicenseTypes, { through: "CountryLicenseType", foreignKey: "CL_CountryId" });
    LicenseTypes.belongsToMany(Countries, { through: "CountryLicenseType", foreignKey: "CL_LicenseTypeId" });



    // Institute and Vehicle Relation   (one-to-many)
    Institute.hasMany(Vehicle, { foreignKey: "InstituteFK" })



    Bought.belongsTo(User, { foreignKey: "UserFK" });

    BoughtCourse.belongsTo(Bought, { foreignKey: "BoughtFK" });
    Bought.hasOne(BoughtCourse, { foreignKey: "BoughtFK" });
    BoughtCourse.belongsTo(CoursePackage, { foreignKey: "CoursePackageFK" });
    CoursePackage.hasMany(BoughtCourse, { foreignKey: "CoursePackageFK" });


    BoughtBook.belongsTo(Bought, { foreignKey: "BoughtFK" });
    Bought.hasOne(BoughtBook, { foreignKey: "BoughtFK" });
    BoughtBook.belongsTo(Book, { foreignKey: "BookFK" });
    Book.hasOne(BoughtBook, { foreignKey: "BookFK" });

    // Institute and Product (Course) Relation when adding Institute will add course to Inventory

    // 1.Institute and CProductToInstitute Relation (one-to-many)
    Institute.hasMany(CProductToInstitute, { foreignKey: "cPI_InstituteId" })
    CProductToInstitute.belongsTo(Institute, { foreignKey: "cPI_InstituteId" })

    // 2.Product and CProductToInstitute Relation (one-to-many)
    Product.hasMany(CProductToInstitute, { foreignKey: "cPI_ProductId" });
    CProductToInstitute.belongsTo(Product, { foreignKey: "cPI_ProductId" })

    // Product.belongsToMany(Institute, { through: CProductToInstitute, foreignKey: "cPI_ProductId" });
    // Institute.belongsToMany(Product, { through: CProductToInstitute, foreignKey: "cPI_InstituteId" });
    // 3.Vehicle and CProductToInstitute Relation (one-to-many)
    Vehicle.hasMany(CProductToInstitute, { foreignKey: "VehicleFK" })
    CProductToInstitute.belongsTo(Vehicle, { foreignKey: "VehicleFK" })

    // 4.Instructor and CProductToInstitute Relation (one-to-many)
    // Instructor.hasMany(CProductToInstitute, { foreignKey: "InstructorFK" })
    // CProductToInstitute.belongsTo(Instructor, { foreignKey: "InstructorFK" })

    // 5.CProductToInstitute and Course Packages Relation (one-to-many)
    CProductToInstitute.hasMany(CoursePackage, { foreignKey: "cPI_Id" });
    CoursePackage.belongsTo(CProductToInstitute, { foreignKey: "cPI_Id" });




    // Vehicle and Vehicle Images Relation (one-to-many)
    Vehicle.hasMany(VehicleImages, { foreignKey: "VehicleFK" })


    // Product and Book Relation (one-to-one)
    Book.belongsTo(Product, { foreignKey: 'ProductFK' });
    Product.hasOne(Book, { foreignKey: 'ProductFK' });


    // Product and Course Relation (one-to-one)
    // Product.belongsTo(Course, { foreignKey: 'CourseId' });


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

    CourseEnrollment.belongsTo(CoursePackage, { foreignKey: "CoursePackageFK" });
    CoursePackage.hasOne(CourseEnrollment, { foreignKey: "CoursePackageFK" });

    CourseEnrollment.belongsTo(User, { foreignKey: "UserFK" });
    User.hasOne(CourseEnrollment, { foreignKey: "UserFK" });
    // CourseEnrollment.belongsTo(Product, { foreignKey: "EnrolledProduct" });

}  