const express = require('express')
const { PayemtGetway } = require('../controller/PaymentController')
const router = express.Router()



//sslcommerz init
router.post('/checkout-page/order',PayemtGetway)

module.exports = router