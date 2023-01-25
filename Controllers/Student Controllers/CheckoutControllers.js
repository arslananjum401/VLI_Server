import db from "../../Conn/connection.js"
import { CapturePaymentFun, CreateOrderFun, generateAccessToken } from '../../Helpers/PayPalHelpers.js';

import { AddShoppingInDb, CheckCourseEnrollment, GetCoursePackagePrice } from '../../Helpers/CheckoutHelpers.js';
import { EnrollInCourse } from "../../Helpers/EnrollmentHelper.js";
const { Bought, BoughtCourse, InstituteCoursePackage, Product, CProductToInstitute, } = db

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


        const FindCoursePackage = await InstituteCoursePackage.findOne({
            where: { IC_PackagesId: req.body.CoursePackageId },
            include: [{ model: CProductToInstitute, include: { model: Product } }]
        })
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
        // const { FindCreateBought } = await CheckCourseEnrollment(req, res)
        // // console.log(FindCreateBought)
        // if (FindCreateBought) {
        //     return
        // }
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
        const order = await CreateOrderFun(create_payment_json);
        // console.log(order)
        return res.status(200).json(order)
    } catch (error) {
        console.log(`Error occurred while creating paypal order ${error}`)
        res.status(500).json(error);
    }
}

export const CapturePayPalPayment = async (req, res) => {

    try {

        const { OrderId } = req.params;
        const { FindCreateBought } = await CheckCourseEnrollment(req, res);

        // if (FindCreateBought) {
        //     return
        // }

        const CapturedData = await CapturePaymentFun(OrderId, generateAccessToken);

        const BoughtCourse = await AddShoppingInDb(req, res);

        if (BoughtCourse.error) {
            return
        }

        const EnrollInCourseData = await EnrollInCourse(req, res, { ...req.body, BoughtCourse });

        if (EnrollInCourseData.error) {
            return
        }
        console.log(CapturedData)
        res.status(200).json(CapturedData);
    } catch (error) {
        console.log(`Error occurred while Capturing paypal order ${error}`)
        res.status(500).json(error);
    }
}