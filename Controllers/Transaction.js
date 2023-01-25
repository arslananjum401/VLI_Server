import fetch from "node-fetch";
import { generateAccessToken } from "../Helpers/CheckoutHelpers.js"

export const PaypalTransaction = async (req, res) => {
    try {

        let { start_date, end_date, page_size, page_number } = req.query;
        if (!page_size) page_size = 10

        if (!page_number) page_number = 1

        if (start_date === "" || !start_date) start_date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
        else start_date = new Date(start_date).toISOString()

        if (end_date === "" || !end_date) end_date = new Date().toISOString()
        else end_date=new Date(end_date).toISOString()


        const AccessToken = await generateAccessToken();


        const response = await fetch(process.env.PAYPAL_BASE_URL + `/v1/reporting/transactions?start_date=${start_date}&end_date=${end_date}&fields=all&page_size=${page_size}&page=${page_number}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AccessToken}`
            }
        });

        const Result = await response.json()
        Result.transaction_details=Result.transaction_details
        res.status(200).json(Result.transaction_details)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}