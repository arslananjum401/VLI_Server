import express from "express";
import { BuyProducts, CapturePayPalPayment, CreatePayPalOrder } from "../Controllers/Student Controllers/CheckoutControllers.js";
import { GetEnrolledCourses, GetUnEnrolledCourses, UnEnrollCourse, GetSingleEnrolledCourse, GetCourseProgress, GetTimeTable } from "../Controllers/Student Controllers/EnrollCourseControllers.js";
import { ViewCourses } from "../Controllers/Student Controllers/StudentCoursesControllers.js";
import { AddInterest, ChangeInterest, RateCourse, AddToCart, GetFullCart, RemoveFromCart } from "../Controllers/StudentControllers.js";
import { PaypalTransaction } from "../Controllers/Transaction.js";
import { CreateWish, DeleteWish, GetWishlist } from "../Controllers/Student Controllers/WishlistControllers.js";
import { AuthenticatedUser ,AuthenticateOptional} from "../Middlewares/Authentication/AuthenticateUser.js";
import { ConfirmPaymentIntent, CreateCustomer, CreatePaymentIntent } from "../Middlewares/StripePayment.js";
import { BuyCourse,PaymentStatus } from "../Controllers/Student Controllers/BuyControllers.js";

const Srouter = express.Router(); 

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
    .get('/enrollCourse', AuthenticatedUser, GetEnrolledCourses)
    .get('/enrollCourse/:EnrollmentId', AuthenticatedUser, GetSingleEnrolledCourse)
    .get('/courseprogress/:EnrollmentId', AuthenticatedUser, GetCourseProgress)
    .get('/timetable/:EnrollmentId', AuthenticatedUser, GetTimeTable)
// .post('/Course/rating', AuthenticatedUser, RateCourse)
// .put('/enrollCourse', AuthenticatedUser, UnEnrollCourse)
// .get('/unenrollCourse', AuthenticatedUser, GetUnEnrolledCourses);

Srouter.get('/Course/:ProductId', AuthenticateOptional, ViewCourses)
 

//Add to cart
Srouter
    .post('/addtocart/:ProductId', AuthenticatedUser, AddToCart)
    .delete('/cart/:ProductId', AuthenticatedUser, RemoveFromCart)
    .get('/cart', AuthenticatedUser, GetFullCart)

//Buy Product
Srouter.post('/buy/course', AuthenticatedUser, BuyCourse)
Srouter.get('/Status/payment/:EnrollmentId', AuthenticatedUser, PaymentStatus)
Srouter.post('/orders', AuthenticatedUser, CreatePayPalOrder)
Srouter.post('/orders/:OrderId/capture', AuthenticatedUser, CapturePayPalPayment);




// .post('/paymentIntent/create', AuthenticatedUser, CreateCustomer, CreatePaymentIntent)
// .post('/Customer/create', AuthenticatedUser, CreateCustomer)
// .post('/paymentIntent/confirm', AuthenticatedUser, ConfirmPaymentIntent)
Srouter.get('/a/paypal', PaypalTransaction)
Srouter.post('/buy/course', AuthenticatedUser, BuyProducts)
export default Srouter;