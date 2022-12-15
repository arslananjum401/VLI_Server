import { ProgressBar } from './Helpers.js';
import db from '../Conn/connection.js'
const { Course, sequelize, CourseEnrollment } = db;
export const ModifyCourseEnrollmentObj = async (EnrolledCourse) => {
    let SEnrolledCoursedata = {}
    SEnrolledCoursedata = EnrolledCourse;

    if (EnrolledCourse) {

        let Result = await ProgressBar(EnrolledCourse);
        SEnrolledCoursedata.Progress = Result;
        const Progress = SEnrolledCoursedata.Progress;
        SEnrolledCoursedata = { ...SEnrolledCoursedata, Progress }
        delete SEnrolledCoursedata.Completion
    }



    return SEnrolledCoursedata
}

// "CourseSubLicenseType":"0e3544f6-7f77-41d4-94b9-1540d633a053",
export const ArrangeCourseObject = (value) => {

    const CourseInfo = value.dataValues.Course.dataValues;
    delete value.dataValues.Course;
    
    CourseInfo.LicenseType = CourseInfo?.LicenseType?.dataValues;
    CourseInfo.VehicleType = CourseInfo?.VehicleType?.dataValues;

    if (CourseInfo?.SubLicenseType) {
        CourseInfo.LicenseType.SubLicenseType=CourseInfo?.SubLicenseType?.dataValues;
        delete  CourseInfo?.SubLicenseType?.dataValues;
    }
    

    value = { ...value.dataValues, Course: CourseInfo, };

    if (value.Course.PossibleKeywords !== null)
        value.Course.PossibleKeywords = JSON.parse(value.Course.PossibleKeywords)

    return value
}


export const ModifyWishListObject = (value) => {
    const Product = value.dataValues.Product.dataValues;
    delete value.dataValues.Product;

    let Course;
    if (Product.Course) {
        Course = Product.Course.dataValues;
        delete Product.Course
    }
    let Book;
    if (Product.Book) {
        Book = Product.Book.dataValues;
        delete Product.Book
    }

    return value = { ...value?.dataValues, ...Product,  ...Course, ...Book }
}

export const ModifyCartObject = (value) => {

    const ProductInfo = value.dataValues.Product.dataValues;
    let CourseInfo;
    if (ProductInfo?.Course !== null && ProductInfo?.Course !== undefined) {
        ProductInfo.Course = ProductInfo.Course.dataValues;
        delete ProductInfo.Book
    }

    let BookInfo

    if (ProductInfo?.Book !== null && ProductInfo?.Book !== undefined) {
        BookInfo = ProductInfo.Book.dataValues;
        delete ProductInfo.Course
    }

    delete value?.dataValues?.Product;
    return value = { ...value?.dataValues, Product: ProductInfo, ...BookInfo, ...CourseInfo }
}