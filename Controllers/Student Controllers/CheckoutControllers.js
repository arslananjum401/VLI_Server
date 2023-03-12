import db from "../../Conn/connection.js"
import { CapturePaymentFun, CreateOrderFun, generateAccessToken } from '../../Helpers/PayPalHelpers.js';

import { AddShoppingInDb, CheckCourseEnrollment, GetCoursePackagePrice } from '../../Helpers/CheckoutHelpers.js';
import { EnrollInCourse } from "../../Helpers/EnrollmentHelper.js";
import { InstituteStaff, io } from "../../app.js";
import { GetSocketId } from "../../Events/Helpers/SaveUser.js";
import { StafftArr } from "../../Events/Institute/Staff/Staff.js";
import { Paginate } from "../../Helpers/Paginate.js";

const { Bought, BoughtCourse, CoursePackages, StudentInfo, InstituteCourses, Institute, Notification, User, InstituteUser } = db

export const BuyProducts = async (req, res) => {
    try {
        console.log("here")
        const FindCreateBought = await Bought.findOne({
            where: { UserFK: req.UserId },
            include: [
                {
                    model: BoughtCourse,
                    where: { CoursePackageFK: req.body.CoursePackageId },
                    required: true
                },
            ]
        })
        if (FindCreateBought) {
            return res.status(200).json({ message: "Package already bought" })
        }


        // const FindCoursePackage = await InstituteCoursePackage.findOne({
        //     where: { IC_PackagesId: req.body.CoursePackageId },
        //     include: [{ model: CProductToInstitute, include: { model: Product } }]
        // })
        let url
        // console.log(FindCoursePackage)
        // await BuyPayWithPaypal(req, res, FindCoursePackage, req.body.Currency, url)

        // .json("hello")
        // const CreateBought = await Bought.create({ UserFK: req.UserId, TotalPrice: req.body.TotalPrice });
        // let BuyProduct
        // if (req.body.ProductType === "Course") {
        //     BuyProduct = await BoughtCourse.create({ CoursePackageFK: req.body.CoursePackageId, BoughtFK: CreateBought.BoughtId })
        // }
        // if (req.body.ProductType === "Book") {
        //     BuyProduct = await BoughtBook.create({ BookFK: req.body.BookFK, BoughtFK: CreateBought.BoughtId })
        // }

        // const GetMyBuyings = await Bought.findOne({
        //     where: { BoughtId: CreateBought.BoughtId },
        //     attributes: { exclude: ["createdAt"] },
        //     include: [
        //         {
        //             model: BoughtCourse,
        //             attributes: { exclude: ["BoughtCourseId", "CoursePackageFK", "createdAt"] },
        //             required: false,
        //             include: {
        //                 model: InstituteCoursePackage,
        //                 attributes: { exclude: ["cPI_Id", "createdAt"] },
        //                 include: {
        //                     model: CProductToInstitute,
        //                     attributes: { exclude: ["cPI_InstituteId", "createdAt"] },
        //                     // include: {
        //                     //     model: Product,
        //                     //     attributes: { exclude: ["createdAt"] },
        //                     //     include: {
        //                     //         model: Course
        //                     //     }
        //                     // }
        //                 }
        //             }
        //         },
        //         {
        //             model: BoughtBook,
        //             include: {
        //                 model: Book
        //             }
        //         }

        //     ]
        // })

        // const product = await GetMyBuyings.BoughtCourse.CoursePackage.CProductToInstitute.getProduct()
        // GetMyBuyings.BoughtCourse.CoursePackage.CProductToInstitute.dataValues.Product = product


        // const course = await product.getCourse();
        // product.dataValues.Course = course


        let Total = 0


        const ProductName = FindCoursePackage.IC_PackagesId.split('-')[0] + FindCoursePackage.CProductToInstitute.Product.ProductName;

        let Products = [{ name: ProductName, sku: ProductName, price: FindCoursePackage.TotalFee, currency: req.body.Currency, quantity: 1 }]
        Products.map((value) => {
            Total = +value.price
        })



        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${req.protocol}://${req.hostname}:3000/success`,
                "cancel_url": `${req.protocol}://${req.hostname}:3000/failure`,
            },
            "transactions": [{
                "item_list": {
                    "items": Products
                },
                "amount": {
                    "currency": "USD",
                    "total": `${Total}`
                },
                "description": "This is the payment description."
            }]
        };

        // paypal.payment.create(create_payment_json, function (error, payment) {
        //     if (payment) {
        //         console.log(payment)
        //         for (let i = 0; i < payment.links.length; i++) {

        //             if (payment.links[i].rel === "approval_url") {
        //                 res.status(200).json({ URL: payment.links[i].href, id: payment.id })
        //             }
        //         }
        //     }

        //     if (error) {
        //         console.log(error.response)
        //         // throw error;
        //     } else {
        //         console.log("Create Payment Response");

        //     }
        // });

    } catch (error) {
        console.log(`Error occurred while buying products: ${error}`)
        res.status(500).json(error)
    }
}

export const CreatePayPalOrder = async (req, res) => {
    try {

        // const FindCreateBuying = await CheckCourseEnrollment(req, res)
        // console.log(FindCreateBuying)
        // if (FindCreateBuying)
        //     return

        const { Products, Total, error } = await GetCoursePackagePrice(req, res)
        var create_payment_json = {
            intent: "CAPTURE",
            purchase_units: Products
            // [
            //     {
            //         // "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b",
            //         amount: {
            //             currency_code: "USD",
            //             value: "100.00"
            //         }
            //     }
            // ]
            ,
            "application_context": {
                "return_url": "http://localhost:3000/return",
                "cancel_url": "https://example.com/cancel"
            }
            // "payment_source": {
            //     "card": {
            //         "number": "4111111111111111",
            //         "expiry": "2020-02",
            //         "name": "John Doe",
            //         "billing_address": {
            //             "address_line_1": "2211 N First Street",
            //             "address_line_2": "17.3.160",
            //             "admin_area_1": "CA",
            //             "admin_area_2": "San Jose",
            //             "postal_code": "95131",
            //             "country_code": "US"
            //         }
            //     },
            //     "stored_credential": {
            //         "payment_initiator": "MERCHANT",
            //         "payment_type": "RECURRING",
            //         "usage": "SUBSEQUENT",
            //         "previous_network_transaction_reference": {
            //             "id": "156GHJ654SFH543",
            //             "network": "VISA"
            //         }
            //     }
            // }
        }

        if (error)
            return
        const order = await CreateOrderFun(create_payment_json);

        return res.status(200).json(order)
    } catch (error) {
        console.log(`Error occurred while creating paypal order ${error}`)
        res.status(500).json(error);
    }
}

export const CapturePayPalPayment = async (req, res) => {

    try {

        const { OrderId } = req.params;

        const { data, error: CapturePaymentError } = await CapturePaymentFun(OrderId, generateAccessToken);
        if (CapturePaymentError)
            return


        let { EnrollmentData, CoursePackageId } = req.body;
        EnrollmentData.StudentData.Schedule = JSON.stringify(EnrollmentData.StudentData.Schedule)
        EnrollmentData.StudentData.FreeHours = JSON.stringify(EnrollmentData.StudentData.FreeHours)
        EnrollmentData.StudentData.UserFK = req.UserId;
        EnrollmentData.StudentData.DOB = new Date(EnrollmentData.StudentData.DOB);
        const AddStudentInfo = StudentInfo.create(EnrollmentData?.StudentData)
        const UpdatePhoneNumber = User.update({ PhoneNumber: EnrollmentData?.StudentData?.PhoneNumber }, {
            where: {
                UserId: req.UserId
            }
        })




        const BoughtCourse = await AddShoppingInDb(req, res);

        if (BoughtCourse.error)
            return



        const { error, EnrolledCourse } = await EnrollInCourse(req, res, BoughtCourse);

        if (error)
            return

        const GetInstitute = await CoursePackages.findOne({
            where: {
                CoursePackageId: req.body?.CoursePackageId
            },
            include: {
                model: InstituteCourses,
                required: true,
                include: {
                    model: Institute,
                    required: true
                }
            }
        })
        const GetInsId = GetInstitute?.InstituteCourse?.Institute
        if (GetInstitute?.InstituteCourse?.Institute?.InstituteId) {


            const StaffIds = await User.findAll({
                include: {
                    model: InstituteUser,
                    where: {
                        InstituteUserType: "Staff"
                    },
                    include: {
                        required: true,
                        model: Institute,
                        where: {
                            InstituteId: GetInsId.InstituteId
                        }
                    }
                }
            })
            const NotificationData = StaffIds.map(value => {
                value = {
                    ToUserId: value?.UserId, ToUserType: "InstituteStaff", NotificationType: "New Enrollment",
                    Message: "Arrange class for " + EnrollmentData?.StudentData?.FirstName + " " + EnrollmentData?.StudentData?.LastName + ".",
                    FromUserId: req.UserId, FromUserType: "InstituteAdmin",
                    RelatedFK: EnrolledCourse.EnrollmentId
                }
                return value
            })
            const NotificationSend = await Notification.bulkCreate(NotificationData);
            let GetStaffUser = await User.findAll({

                include: {
                    model: InstituteUser,
                    where: { InstituteUserType: "Staff" },
                    required: true,

                    include: {
                        model: Institute,
                        where: { InstituteId: GetInsId?.InstituteId },
                        required: true,
                    }
                }
            })


            GetStaffUser = GetStaffUser.filter((User) => {
                return GetSocketId(StafftArr, User?.UserId) !== undefined
            })


            GetStaffUser = await Promise.all(GetStaffUser.map(async value => {
                const AllNotifications = await Notification.findAll({
                    where: { ToUserId: value.UserId },
                    ...Paginate({ Page: 1, PageSize: 1 }),
                    order: [['createdAt', "desc"]]
                })

                return { UserId: value?.UserId, Notifications: AllNotifications }
            }))

            GetStaffUser.forEach(async User => {
                let GetUser = GetSocketId(StafftArr, User.UserId);
                await new Promise((resolve, reject) => {
                    InstituteStaff.to(GetUser?.SocketId).emit("CourseRecommended", User?.Notifications);
                    resolve(true)
                })
            })
  
            // const Create = await Notification.create({
            //     NotificationType: "New Enrollment",
            //     Message: "Arrange class for " + EnrollmentData?.StudentData?.FirstName + " " + EnrollmentData?.StudentData?.LastName,
            //     ToUserId: req.UserId,
            //     ToUserType: "InstituteStaff",
            //     EnrollmentFK: EnrolledCourse.EnrollmentId,
            //     FromUserId: req.UserId,
            //     FromUserType: "Student"
            // })




            // console.log(Create)
            // const GetNotifications = await Notification.findAll({
            //     where: {
            //         ToUserId: req.UserId
            //     },
            //     limit: 5
            // })
            // io.to(GetInstitute?.InstituteCourse?.Institute?.InstituteId + "Staff")
            //     .emit("NewStudent", GetNotifications);
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(`Error occurred while Capturing paypal order ${error}`)
        res.status(500).json(error);
    }
} 