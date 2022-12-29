import { Sequelize, DataTypes } from 'sequelize';
import { LicenseTypeModel, SubLicenseTypeModel, CourseModel, VehicleTypesModel, CountryModel, CountryLicenseTypeModel, bookModel, BookReputationInfo } from '../Models/Admin.js';
import { CourseEnrollmentModel } from '../Models/CourseErnrollment.js';
import { WishListModel } from '../Models/WishList.js';
import { ForwardedCourseModel, Institute, } from '../Models/Institute.js';
import { NotificationModel } from '../Models/Notifications.js';
import { StudentInterestModel } from '../Models/StudentInterest.js';
import { InstituteUsersModel, UserModel, UserEmailValidationModel, UserResetPasswordModel } from '../Models/User.js';
import { BuyingModel, BoughtCourseModel, BoughtBookModel } from '../Models/Buying.js';
import { CartModel } from '../Models/Cart.js';
import { ProductModel } from '../Models/Product.js';
import { InstructorModel } from '../Models/Institute/Instructor.js';
import { VehicleImagesModel, VehicleModel } from '../Models/Institute/Vehicle.js';
import { ClassScheduleModel, CoursePackagesModel, CourseSyllabusModel, InstituteCourseModel } from '../Models/Institute/InstituteCourse.js';
import { CourseInstructorsModel } from '../Models/Institute/InstituteCourseRelation.js';

export const sequelize = new Sequelize(
    'frkmgtsm',//Databse name
    'frkmgtsm',//username
    'Cl1V8f-ZV0r5n5l0pFfuPy84kI4nF2Px',//password
    {
        host: 'peanut.db.elephantsql.com',
        dialect: "postgres",
        logging: false
    }
);
const db = {}
const sequelApp = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true })
            .then(() => { console.log('Re-sync Done') });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
db.sequelize = sequelize
db.DataTypes = DataTypes;

db.User = await UserModel(sequelize, DataTypes, db.Student);
db.UserEmailValidation = await UserEmailValidationModel(sequelize, DataTypes, db.User)

db.Institute = await Institute(sequelize, DataTypes, db.User)
db.InstituteUser = await InstituteUsersModel(sequelize, DataTypes, db.User, db.Institute)
db.UserResetPassword = UserResetPasswordModel(sequelize, DataTypes, db.User)

db.LicenseTypes = await LicenseTypeModel(sequelize, DataTypes);
db.SubLicenseTypes = await SubLicenseTypeModel(sequelize, DataTypes, db.LicenseTypes);
db.Product = await ProductModel(sequelize, DataTypes, db.LicenseTypes);
db.VehicleTypes = await VehicleTypesModel(sequelize, DataTypes,)
db.Course = await CourseModel(sequelize, DataTypes, db.Product, db.VehicleTypes, db.LicenseTypes, db.SubLicenseTypes);
db.Book = await bookModel(sequelize, DataTypes, db.User, db.Product);

db.Instructor = await InstructorModel(sequelize, DataTypes, db.Institute, db.LicenseTypes, db.User);

db.Notification = await NotificationModel(sequelize, DataTypes, db.User);
db.StudentInterest = await StudentInterestModel(sequelize, DataTypes, db.User, db.LicenseTypes);

db.Vehicle = await VehicleModel(sequelize, DataTypes, db.Institute);
db.VehicleImages = await VehicleImagesModel(sequelize, DataTypes, db.Vehicle)



db.InstituteCourses = await InstituteCourseModel(sequelize, DataTypes, db.Institute, db.Vehicle, db.Course);
db.CoursePackages = await CoursePackagesModel(sequelize, DataTypes, db.InstituteCourses)
db.CourseInstructors = await CourseInstructorsModel(sequelize, DataTypes, db.InstituteCourses, db.Instructor);
 
db.CourseSyllabus = await CourseSyllabusModel(sequelize, DataTypes, db.InstituteCourses)
db.ClassSchedule = await ClassScheduleModel(sequelize, DataTypes, db.InstituteCourses)

db.WishList = await WishListModel(sequelize, DataTypes, db.InstituteCourses, db.User);


db.Buying = await BuyingModel(sequelize, DataTypes, db.User, db.Product);
db.BoughtCourse = await BoughtCourseModel(sequelize, DataTypes, db.CoursePackages, db.Buying);
db.BoughtBook = await BoughtBookModel(sequelize, DataTypes, db.Book, db.Buying);


db.CourseEnrollment = await CourseEnrollmentModel(sequelize, DataTypes, db.CoursePackages, db.User, db.BoughtCourse);
db.CountryLicenseType = await CountryLicenseTypeModel(sequelize, DataTypes)
db.Countries = await CountryModel(sequelize, DataTypes);
db.Cart = await CartModel(sequelize, DataTypes, db.User, db.Product)
db.ForwardedCourse = await ForwardedCourseModel(sequelize, DataTypes, db.Institute, db.Product, db.User)
db.BookReputationInfo = await BookReputationInfo(sequelize, DataTypes, db.Book)
export default db;

sequelApp();  