import { request } from "express";
import stripe from "stripe";
import db from '../Conn/connection.js';
import { Stripe } from '../server.js'
import { SendReceipt } from "./SendEmailToVerify.js";
const { User, Product } = db;

export const CreateCustomer = async (req, res, next) => {
    let CheckCustomer
    if (req.User?.CustomerId) {
        CheckCustomer = await Stripe.customers.retrieve(req?.User?.CustomerId)
    }
    try {

        if (!req.User?.CustomerId || (req.User?.CustomerId && CheckCustomer.deleted === true)) {

            const customer = await Stripe.customers.create(
                {
                    email: req.User.Email,
                    name: req.User.UserName,
                }
            );
            // console.log(customer);
            const Info = await User.update({
                CustomerId: customer.id
            },
                {
                    where: {
                        UserId: req.UserId,

                    }
                }
            )
            req.User.CustomerId = customer.id;
        }
        next()
    }
    catch (error) {
        console.log(`error occurred while creating customer ${error}`);
        return res.status(500).json(error)
    }
}


export const CreateCharge = async (req, res, next) => {
    try {
        const { Price, Currency, Description } = req.body
        const charge = await Stripe.charges.create({
            amount: Price * 100,
            currency: Currency,
            source: 'tok_amex',
            description: Description,
            receipt_email: req.User.Email
        });
    } catch (error) {
        console.log(`error occurred while creating charge ${error}`)
        return res.status(500).json(error)
    }
}


export const CreatePaymentIntent = async (req, res) => {
    try {
        const Intent = await Stripe.paymentIntents.create({
            amount: req.body.Price * 100,
            currency: 'usd',
            receipt_email: req.User.Email,
            customer: req.User.CustomerId,
            // payment_method: payment_method,
            payment_method_types: req.body.payment_method_types,
        })

        res.status(200).json(Intent)
    } catch (error) {
        console.log(`error occurred while creating payment Intent ${error}`);
        return res.status(500).json(error)
    }
}
export const ConfirmPaymentIntent = async (req, res) => {
    try {

        const CheckProduct = await Product.findAll();
        let Products = ''
        req.body.ProductsInCart.forEach((value) => {
            Products += `<span class="Product">
                            <h3>${value.ProductName}</h3>
                            <h3>$${value.Price}</h3>
                        </span>`
        })

        const replacements = {
            // Products,
            UserName: req.User.UserName,
            TotalPrice: req.body.Price
        }
        SendReceipt(req.User, req, replacements)
        const Intent = await Stripe.paymentIntents.confirm(`${req.body.IntentId}`,

            { payment_method: 'pm_card_visa' }
        )

        res.status(200).json(Intent)
    } catch (error) {
        console.log(`error occurred while confirming payment Intent ${error}`);
        return res.status(500).json(error)
    }
}
