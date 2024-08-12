const express = require("express")
const dotenv = require('dotenv')
dotenv.config({path : '../config/config.env'})
const cashAsyncError = require("../middleware/cashAsyncError")
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'daily66adb1f2a6a30';
const store_passwd = "daily66adb1f2a6a30@ssl"
const is_live = false //true for live, false for sandbox
const Product = require('../models/productModels')
const { v4: uuidv4 } = require('uuid');

function generateTransactionId() {
  return uuidv4();
}

exports.PayemtGetway = cashAsyncError(async(req, res) => {
   const tran_Id = generateTransactionId()
   const {adress} = req.body.address
    const {productId } = req.body.productId
    const product = await Product.findOne({id : productId})
   // console.log(product)
  //  const productPrice = Product?.productPrice
   const amount = product?.currentprice
    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: tran_Id, // use unique tran_id for each api call
        success_url: 'http://localhost:3030/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: `${adress}`,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    console.log(data)
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({url : GatewayPageURL})
        console.log('Redirecting to: ', GatewayPageURL)
    });
})

