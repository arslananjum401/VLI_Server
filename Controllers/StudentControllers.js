import db from '../Conn/connection.js'
import { CalculateRating, CheckCompletion, CheckRunningMark, ProgressBar } from '../Helpers/Helpers.js';
import { ModifyCartObject, ModifyCourseEnrollmentObj } from '../Helpers/ChangeObject.js';
import { ArrangeCourseObject } from '../Helpers/ChangeObject.js';
import { ModifyWishListObject } from '../Helpers/ChangeObject.js'

const { WishList, CourseEnrollment, StudentInterest, Course, Cart, Book, Product, LicenseTypes, Institute } = db;


export const GetWishlist = async (req, res) => {
    try {
        let GetWishes = await WishList.findAll({
            where: { StudentId: req.UserId },
            order: [['createdAt', 'ASC']],

            include: [
                {
                    model: Product,
                    required: true,
                    include: [

                        {
                            model: Course,
                            include: { model: LicenseTypes, attributes: ["LicenseTypeName"] },
                        },
                        { model: Book, }
                    ]
                },
            ]
        });

        GetWishes = GetWishes.map((value) => {
            return ModifyWishListObject(value)
        })
        res.status(200).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Getting Wish list: ${error}`);
        return res.status(500).json(error);
    }
}
export const CreateWish = async (req, res) => {
    req.body.StudentId = req.UserId;
    try {
        const FindWish = await WishList.findOne({
            where: {
                WishedProduct: req.body.Wish,
                StudentId: req.body.StudentId
            }
        });

        if (FindWish) {
            const GetAllWished = await WishList.findAll({

                where: {
                    StudentId: req.UserId
                },
                order: [
                    ['createdAt', 'ASC'],
                ],

            })
            return res.status(201).json(GetAllWished);
        }

        const CreateWish = await WishList.create({
            WishedProduct: req.body.Wish,
            StudentId: req.body.StudentId
        });
        let GetWishes = await WishList.findAll({
            where: {
                StudentId: req.UserId
            },
            order: [
                ['createdAt', 'ASC'],
            ],

            include: [
                {
                    model: Product,
                    required: true,
                    include: [

                        { model: Course, include: { model: LicenseTypes, attributes: ["LicenseTypeName"] }, },
                        { model: Book, }
                    ]
                },
            ]
        });
        GetWishes = GetWishes.map((value) => {
            return ModifyWishListObject(value)
        })
        res.status(201).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Creating Wish list: ${error}`);
        return res.status(500).json(error);
    }
}

export const DeleteWish = async (req, res) => {

    try {
        const Delete = await WishList.destroy({
            where: {
                WishId: req.body.WishId
            }
        });
        let GetWishes = await WishList.findAll({
            where: {
                StudentId: req.UserId
            },
            order: [
                ['createdAt', 'ASC'],
            ],

            include: [
                {
                    model: Product,
                    required: true,
                    include: [

                        { model: Course, include: { model: LicenseTypes, attributes: ["LicenseTypeName"] }, },
                        { model: Book, }
                    ]
                },
            ]
        });

        GetWishes = GetWishes.map((value) => {
            return ModifyWishListObject(value)
        })

        res.status(200).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Deleting Wish: ${error}`);
        return res.status(500).json(error);
    }
}


export const AddInterest = async (req, res) => {
    req.body.StudentId = req.UserId;
    try {

        const CheckInterest = await StudentInterest.findOne({
            where: {
                StudentId: req.UserId,
                CourseLicenseType: req.body.CourseLicenseType
            }
        });
        if (CheckInterest) {
            return res.status(403).json({ message: "Interest already added" });
        }

        const AddInteres = await StudentInterest.create(req.body);

        res.status(200).json(AddInteres);
    } catch (error) {
        console.log(`error occurred while Getting Interest : ${error}`);
        return res.status(500).json(error)
    }
}


export const ChangeInterest = async (req, res) => {
    try {

        const ChangedInterest = await StudentInterest.update(req.body, {
            where: {
                InterestId: req.body.InterestId
            }
        });
        const Interest = await StudentInterest.findOne({
            where: {
                StudentId: req.UserId,
            }
        })
        res.status(201).json(Interest);
    } catch (error) {
        console.log(`error occurred while Changing Student Interest: ${error}`);
        return res.status(500).json(error)
    }
}


export const RateCourse = async (req, res) => {
    try {
        await CourseEnrollment.update({
            CourseRating: req.body.CourseRating,
            Rated: true
        }, {
            where: {
                EnrollmentId: req.body.EnrollmentId
            }
        });


        let RatedCourseEnrolment = await CourseEnrollment.findOne({
            where: {
                EnrollmentId: req.body.EnrollmentId
            },

        })



        RatedCourseEnrolment = { ...RatedCourseEnrolment.dataValues }
        const data = await CalculateRating(RatedCourseEnrolment.EnrolledCourse)
        await Course.update({
            OverallRating: data
        }, {
            where: {
                CoursePK: RatedCourseEnrolment.EnrolledCourse
            }
        })
        let RatedCourse = await Product.findOne({
            where: {
                ProductId: RatedCourseEnrolment.EnrolledProduct
            },

            include: [{ model: LicenseTypes, attributes: ["LicenseTypeName"] },
            {
                model: Course,
                include: { model: Institute, attributes: ["InstituteName"] }
            }]
        })
        RatedCourse = ArrangeCourseObject(RatedCourse)
        const OBJ = await ModifyCourseEnrollmentObj(RatedCourseEnrolment)


        res.status(201).json({ RatedCourseEnrolment: OBJ, RatedCourse: RatedCourse });
    } catch (error) {
        console.log(`error occurred while Rating Course : ${error}`);
        return res.status(500).json(error)
    }
}



export const AddToCart = async (req, res) => {
    try {

        const CheckCart = await Cart.findOne({
            where: { AddedById: req.UserId, },

            include: {
                model: Product, where: { ProductId: req.params.ProductId },

                include: [{ model: Book }, { model: Course },],
            },
        });

        if (CheckCart) {
            return res.status(200).json({ message: "Product Already Added" })
        }

        req.body.AddedById = req.UserId;

        req.body.CartedProductId = req.params.ProductId;
        const addtocart = await Cart.create(req.body)


        let GetCartedProduct = await Cart.findAll({
            where: { AddedById: req.UserId },
            include: {
                required: true,
                model: Product,
                include: [
                    { model: Course, },
                    { model: Book, }]
            },
        });


        const Modified = GetCartedProduct?.map((value) => {
            return ModifyCartObject(value)
        })
        res.status(201).json(Modified)
    } catch (error) {
        console.log(`error occurred while Adding product to Cart : ${error}`);
        return res.status(500).json(error)
    }
}


export const GetFullCart = async (req, res) => {
    try {
        const GetCart = await Cart.findAll({
            where: { AddedById: req.UserId },
            include: {
                required: true,
                model: Product,
                include: [
                    { model: Course, },
                    { model: Book, }]
            },
        });


        const Modified = GetCart?.map((value) => {
            value = ModifyCartObject(value)
            return value
        })
        res.status(200).json(Modified);
    } catch (error) {
        console.log(`error occurred while Getting Full Cart : ${error}`);
        return res.status(500).json(error)
    }
}

export const RemoveFromCart = async (req, res) => {
    try {
        const DestroyedCart = await Cart.destroy({
            where: {
                CartedProductId: req.params.ProductId,
            }
        })
        const GetCart = await Cart.findAll({
            where: { AddedById: req.UserId },
            include: {
                required: true,
                model: Product,
                include: [
                    { model: Course, },
                    { model: Book, }]
            },
        });


        const Modified = GetCart?.map((value) => {
            value = ModifyCartObject(value)
            return value
        })

        res.status(201).json(Modified);
    } catch (error) {
        console.log(`error occurred while Removing product from Cart : ${error}`);
        return res.status(500).json(error)
    }
}


export const CreatePaymentIntent = (req, res) => {
    try {

    } catch (error) {

    }
}