const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to parse JSON
app.use(express.json());

// Endpoint to create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Debugging: Log the incoming request body

    const { priceId, isRecurring } = req.body; // Extract Price ID and recurring flag
    console.log('Received Price ID:', priceId, 'Recurring:', isRecurring); // Log details

    // Determine mode based on whether the price is recurring
    const mode = isRecurring ? 'subscription' : 'payment';

    // Create the Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Specify payment methods
      line_items: [
        {
          price: priceId, // Use the provided Price ID
          quantity: 1, // Set quantity to 1
        },
      ],
      mode: mode, // Dynamically set mode
      success_url: 'http://localhost:3000/success', // Redirect on success
      cancel_url: 'http://localhost:3000/cancel', // Redirect on cancel
    });

    console.log('Session Created:', session); // Debugging: Log the created session
    res.json({ url: session.url }); // Respond with the session URL
  } catch (error) {
    console.error('Error creating checkout session:', error.message); // Log error details
    res.status(500).json({ error: 'Unable to create session' }); // Respond with error message
  }
});

// Start the server
const PORT = process.env.PORT || 4242; // Use PORT from .env or default to 4242
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
