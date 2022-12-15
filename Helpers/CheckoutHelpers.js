import db from "../Conn/connection.js"
import fetch from "node-fetch";

const { Bought, InstituteCoursePackage, CProductToInstitute, Product, BoughtCourse, CourseEnrollment } = db;

export const CheckCourseEnrollment = async (req, res) => {

    try {

        let FindCreateBought = false;
        const { CoursePackageId } = req.body

        for (let i = 0; i < CoursePackageId.length; i++) {

            let Package = await Bought.findOne({
                where: { UserFK: req.UserId },
                include: [
                    {
                        model: BoughtCourse,
                        where: { CoursePackageFK: CoursePackageId[i]},
                        required: true
                    },
                ]
            })
            if (Package) {
                FindCreateBought = true
            }
        }


        if (FindCreateBought) {
            res.status(200).json({ message: "Package already bought" })
        }
        return { FindCreateBought }

    } catch (error) {

    }
}


export const GetCoursePackagePrice = async (req, res) => {
    try {
        let Total = 0
        const FindCoursePackages = await Promise.all(req.body.CoursePackageId.map(async (value) => {
            return await InstituteCoursePackage.findOne({
                where: { IC_PackagesId: value },
                include: [{ model: CProductToInstitute, include: { model: Product } }]
            })
        }))

        if (!FindCoursePackages) {
            return res.status(404).json({ message: "Course Package not found" })
        }
        let Products = FindCoursePackages.map((Package) => {
            const ProductName = Package.IC_PackagesId.split('-')[0] + Package.CProductToInstitute.Product.ProductName;
            return { name: ProductName, sku: ProductName, amount: { value: Package.TotalFee, currency_code: req.body.Currency }, quantity: 1 }
        })


        Products.forEach((value) => {
            Total = +value.amount.value
        })
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
        const { CoursePackageId } = req.body;
        req.body.UserFK = req.UserId;
        const BoughtR = await Bought.create(req.body);
        req.body.BoughtCourse = [];


        for (let i = 0; i < CoursePackageId.length; i++) {
            req.body.BoughtFK = BoughtR.BoughtId;
            req.body.CoursePackageFK = CoursePackageId[i];

            const BoughtCourseR = await BoughtCourse.create(req.body);
            req.body.BoughtCourse.push({ BoughtCourseFK: BoughtCourseR.BoughtCourseId, CoursePackageId: CoursePackageId[i] })
        }
        return req.body.BoughtCourse
    } catch (error) {
        res.status(500).json({ error })

        return { error }
    }
}