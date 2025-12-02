// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe Checkout session for booking
// @access  Public
router.post('/create-checkout-session', async (req, res) => {
  try {
    const {
      van,
      pricing,
      pickupDate,
      pickupTime,
      duration,
      customer,
      needsDriver,
      pickupAddress,
      dropoffAddress,
      driversLicense,
    } = req.body;

    // Validate required fields
    if (!van || !pricing || !customer) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information',
      });
    }

    // Build line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${van.name} Rental`,
            description: `${van.year} ${van.type} • ${pricing.days} day${pricing.days > 1 ? 's' : ''} (${pricing.hours} hours)`,
            images: van.images && van.images.length > 0 ? [van.images[0]] : [],
          },
          unit_amount: Math.round(pricing.rentalFee * 100), // Stripe uses cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Insurance Fee',
            description: 'Mandatory rental insurance coverage',
          },
          unit_amount: Math.round(pricing.insuranceFee * 100),
        },
        quantity: 1,
      },
    ];

    // Add destination fee if applicable
    if (pricing.destinationFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Destination Fee',
            description: 'Additional mileage/destination charge',
          },
          unit_amount: Math.round(pricing.destinationFee * 100),
        },
        quantity: 1,
      });
    }

    // Add security deposit
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Security Deposit',
          description: 'Refundable security deposit (returned after rental)',
        },
        unit_amount: Math.round(pricing.deposit * 100),
      },
      quantity: 1,
    });

    // Store booking metadata for webhook processing
    const metadata = {
      vanId: van._id || van.id,
      vanName: van.name,
      pickupDate,
      pickupTime,
      duration,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      contactPreference: customer.contactPreference,
      needsDriver: needsDriver ? 'true' : 'false',
      pickupAddress: pickupAddress || '',
      dropoffAddress: dropoffAddress || '',
      rentalFee: pricing.rentalFee.toString(),
      insuranceFee: pricing.insuranceFee.toString(),
      deposit: pricing.deposit.toString(),
      total: pricing.total.toString(),
    };

    // Add license info if self-driving
    if (driversLicense) {
      metadata.licenseNumber = driversLicense.licenseNumber;
      metadata.licenseState = driversLicense.licenseState;
      metadata.licenseExpiration = driversLicense.licenseExpiration;
      metadata.licenseImageUrl = driversLicense.licenseImageUrl || '';
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customer.email,
      line_items: lineItems,
      metadata,
      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking?canceled=true`,
      // Collect billing address
      billing_address_collection: 'required',
      // Add phone number collection
      phone_number_collection: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session',
    });
  }
});

// @route   GET /api/payments/session/:sessionId
// @desc    Get checkout session details (for success page)
// @access  Public
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total / 100,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve session',
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe signature verified)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);

      // TODO: Create booking in database
      // TODO: Send confirmation email
      // TODO: Update van availability

      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// @route   POST /api/payments/refund
// @desc    Process refund for a booking
// @access  Private (Admin only)
router.post('/refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    }

    const refundParams = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
    };

    // Partial refund if amount specified
    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund',
    });
  }
});

module.exports = router;
