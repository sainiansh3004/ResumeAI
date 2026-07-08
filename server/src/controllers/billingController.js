const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "dummy_secret_key");
const User = require("../models/User");

// ==========================
// Create Stripe Checkout Session
// ==========================
const createCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    // Setup checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ResumeAI Pro Subscription",
              description: "Unlimited premium templates, AI optimizer suite, and personal portfolio hosting.",
            },
            unit_amount: 1200, // $12.00 USD
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
      success_url: `${clientUrl}/dashboard?payment=success`,
      cancel_url: `${clientUrl}/dashboard?payment=cancel`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Stripe integration failed.",
      error: error.message,
    });
  }
};

// ==========================
// Stripe Webhook Receiver
// ==========================
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = req.body;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Fallback fallback for local testing where webhook sign is not present
      event = req.body;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle transaction events
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isPro: true,
          stripeCustomerId: session.customer || "",
          stripeSubscriptionId: session.subscription || "",
        });
        console.log(`User ${userId} successfully upgraded to Pro via Webhook.`);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      
      // Revoke access when subscription is canceled/deleted
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { isPro: false }
      );
      console.log(`Subscription ${subscription.id} deleted. Access revoked.`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).send("Internal Webhook processing error.");
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
};
