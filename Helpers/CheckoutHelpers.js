import db from "../Conn/connection.js"
import fetch from "node-fetch";

const { Buying, CoursePackages, InstituteCourses, Course, BoughtCourse, CourseEnrollment } = db;

export const CheckCourseEnrollment = async (req, res) => {

    try {

        let FindCreateBuying = false;
        const { CoursePackageId } = req.body


        let Package = await Buying.findOne({
            where: { UserFK: req.UserId },
            include: [
                {
                    model: BoughtCourse,
                    where: { CoursePackageFK: CoursePackageId },
                    required: true
                },
            ]
        })
        if (Package)
            FindCreateBuying = true




        if (FindCreateBuying) {
            res.status(200).json({ message: "Package already bought" })
        }
        return FindCreateBuying

    } catch (error) {
        console.log(`Error occurred while checking course enrollment ${error}`)
    }
}


export const GetCoursePackagePrice = async (req, res) => {
    try {
        let Total = 0;

        const FindCoursePackages = await CoursePackages.findOne({
            where: { CoursePackageId: req.body.CoursePackageId },
            include: [{ model: InstituteCourses, include: { model: Course } }]
        });



        if (!FindCoursePackages)
            return res.status(404).json({ message: "Course Package not found" })

        let Products
        const ProductName = FindCoursePackages.CoursePackageId.split('-')[0] + FindCoursePackages.InstituteCourse.Course.CourseName;
        Products = [{ name: ProductName, sku: ProductName, amount: { value: FindCoursePackages.TotalFee, currency_code: req.body.Currency }, quantity: 1 }
        ]
        Total = Products?.amount?.value
        return { Products, Total }
    } catch (error) {
        console.log("Error ocurred while getting course package price and total amount:", error)
        res.status(500).json({ error });

        return { error }
    }
}
export async function CreateOrderFun(JsonBody) {
    try {
        const accessToken = await generateAccessToken();
        const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(JsonBody),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Error occurred while Creating order fun${error}`)

    }

}

export async function CapturePaymentFun(orderId, generateAccessToken) {
    try {
        const AccessToken = await generateAccessToken();
        const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AccessToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Error occurred while Capturing payment fun ${error}`)
    }

}


export const generateAccessToken = async () => {
    try {
        const response = await fetch(process.env.PAYPAL_BASE_URL + "/v1/oauth2/token", {
            method: "post",
            body: "grant_type=client_credentials",
            headers: {
                Authorization:
                    "Basic " + Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET).toString("Base64"),
            },
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.log(`Error occurred while Getting paypal access token fun ${error}`)
    }
}


export const AddShoppingInDb = async (req, res) => {
    try {
        const { CoursePackageId, TotalPrice } = req.body;

        const BoughtR = await Buying.create({
            UserFK: req.UserId,
            TotalPrice: TotalPrice
        });

        const BoughtCourseR = await BoughtCourse.create({
            BuyingFK: BoughtR.BuyingId,
            InstallmentsPaid: req.body.Installments,
            CoursePackageFK: CoursePackageId
        });

        req.body.BoughtCourse = { BoughtCourseFK: BoughtCourseR.BoughtCourseId, CoursePackageFK: CoursePackageId }



        return req.body.BoughtCourse
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })

        return { error }
    }
}