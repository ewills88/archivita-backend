const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');

// POST route for creating a Stripe Checkout session
router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
