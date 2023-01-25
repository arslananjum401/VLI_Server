import db from '../connection.js';

const { Course, User, LicenseTypes, Countries, VehicleTypes, CourseEnrollment, SubLicenseTypes, BoughtCourse, Institute, CoursePackages, InstituteCourses, Vehicle, CourseSyllabus, ClassSchedule } = db;
export function CourseRelations() {

    Course.belongsTo(LicenseTypes, { foreignKey: 'LicenseTypeFK' });
    LicenseTypes.hasMany(Course, { foreignKey: 'LicenseTypeFK' });

    Course.belongsTo(SubLicenseTypes, { foreignKey: 'SubLicenseTypeFK' });
    SubLicenseTypes.hasMany(Course, { foreignKey: 'SubLicenseTypeFK' });

    Course.belongsTo(VehicleTypes, { foreignKey: 'VehicleTypeFK' });
    VehicleTypes.hasMany(Course, { foreignKey: 'VehicleTypeFK' });

    Countries.belongsToMany(LicenseTypes, { through: "CountryLicenseType", foreignKey: "CL_CountryId" });
    LicenseTypes.belongsToMany(Countries, { through: "CountryLicenseType", foreignKey: "CL_LicenseTypeId" });

}


export function CourseEnrollmentRelations() {
    CourseEnrollment.belongsTo(BoughtCourse, { foreignKey: "BoughtCourseFK" });
    BoughtCourse.hasOne(CourseEnrollment, { foreignKey: "BoughtCourseFK" });

    CourseEnrollment.belongsTo(CoursePackages, { foreignKey: "CoursePackageFK" });
    CoursePackages.hasOne(CourseEnrollment, { foreignKey: "CoursePackageFK" });

    CourseEnrollment.belongsTo(User, { foreignKey: "UserFK" });
    User.hasOne(CourseEnrollment, { foreignKey: "UserFK" });
}

export function InstituteCourseRelations() {

    Institute.hasMany(InstituteCourses, { foreignKey: "InstituteFK" })
    InstituteCourses.belongsTo(Institute, { foreignKey: "InstituteFK" })

    Vehicle.hasMany(InstituteCourses, { onUpdate: "CASCADE", foreignKey: "VehicleFK" })
    InstituteCourses.belongsTo(Vehicle, { onUpdate: "CASCADE", foreignKey: "VehicleFK" })

    InstituteCourses.hasMany(CoursePackages, { foreignKey: "InstituteCourseFK" });
    CoursePackages.belongsTo(InstituteCourses, { foreignKey: "InstituteCourseFK" });

    Course.hasMany(InstituteCourses, { onDelete: 'CASCADE', foreignKey: "CourseFK" })
    InstituteCourses.belongsTo(Course, { onDelete: 'CASCADE', foreignKey: "CourseFK" })


    CourseSyllabus.belongsTo(InstituteCourses, { onDelete: 'CASCADE', foreignKey: "InstituteCourseFK" })
    InstituteCourses.hasMany(CourseSyllabus, { onDelete: 'CASCADE', foreignKey: "InstituteCourseFK" })


    ClassSchedule.belongsTo(InstituteCourses, { onDelete: 'CASCADE', foreignKey: "InstituteCourseFK" })
    InstituteCourses.hasMany(ClassSchedule, { onDelete: 'CASCADE', foreignKey: "InstituteCourseFK" })
}
