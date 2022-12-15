import fetch from "node-fetch";

const Base = "https://api-m.sandbox.paypal.com";
export async function CreateOrderFun(JsonBody) {
    try {
        const accessToken = await generateAccessToken();
        const url = `${Base}/v2/checkout/orders`;
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
        const url = `${Base}/v2/checkout/orders/${orderId}/capture`;
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
        const response = await fetch(Base + "/v1/oauth2/token", {
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