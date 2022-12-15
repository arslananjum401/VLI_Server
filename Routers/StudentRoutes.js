import express from "express";
import { BuyProducts, CapturePayPalPayment, CreatePayPalOrder } from "../Controllers/Student Controllers/CheckoutControllers.js";
import { EnrollCourse, GetEnrolledCourses, GetUnEnrolledCourses, UnEnrollCourse, GetSingleEnrolledCourse } from "../Controllers/Student Controllers/EnrollCourseControllers.js";
import { ViewCourses } from "../Controllers/Student Controllers/StudentCoursesControllers.js";
import { GetWishlist, CreateWish, DeleteWish, AddInterest, ChangeInterest, RateCourse, AddToCart, GetFullCart, RemoveFromCart } from "../Controllers/StudentControllers.js";
import { PaypalTransaction } from "../Controllers/Transaction.js";
import { AuthenticatedUser } from "../Middlewares/AuthenticateUser.js";
import { ConfirmPaymentIntent, CreateCustomer, CreatePaymentIntent } from "../Middlewares/StripePayment.js";

const Srouter = express.Router();
const OptionalAuthenticatedUser = async (req, res, next) => {
    const { token } = await req.cookies;
    if (token) {
        return AuthenticatedUser(req, res, next)
    }
    next()
}
//Interest
Srouter
    .post('/me/Interest', AuthenticatedUser, AddInterest)
    .put('/me/Interest', AuthenticatedUser, ChangeInterest)
//WishList 
Srouter
    .post('/wishlist', AuthenticatedUser, CreateWish)
    .get('/wishlist', AuthenticatedUser, GetWishlist)
    .delete('/wishlist', AuthenticatedUser, DeleteWish)

//EnrollCourse
Srouter
    .post('/enrollCourse', AuthenticatedUser, EnrollCourse)
    .get('/enrollCourse', AuthenticatedUser, GetEnrolledCourses)
    .get('/enrollCourse/:CoursePK', AuthenticatedUser, GetSingleEnrolledCourse)
    .post('/Course/rating', AuthenticatedUser, RateCourse)
    .put('/enrollCourse', AuthenticatedUser, UnEnrollCourse)
    .get('/unenrollCourse', AuthenticatedUser, GetUnEnrolledCourses);

Srouter.get('/Course/:ProductId', OptionalAuthenticatedUser, ViewCourses)
//Add to cart
Srouter
    .post('/addtocart/:ProductId', AuthenticatedUser, AddToCart)
    .delete('/cart/:ProductId', AuthenticatedUser, RemoveFromCart)
    .get('/cart', AuthenticatedUser, GetFullCart)

//Buy Product
// Srouter.get('/buy', AuthenticatedUser, PayWithPaypal)
Srouter.post('/orders', AuthenticatedUser, CreatePayPalOrder)
Srouter.post('/orders/:OrderId/capture', AuthenticatedUser, CapturePayPalPayment)


// .post('/paymentIntent/create', AuthenticatedUser, CreateCustomer, CreatePaymentIntent)
// .post('/Customer/create', AuthenticatedUser, CreateCustomer)
// .post('/paymentIntent/confirm', AuthenticatedUser, ConfirmPaymentIntent)
Srouter.get('/a/paypal',PaypalTransaction)
Srouter.post('/buy/course', AuthenticatedUser, BuyProducts)
export default Srouter;