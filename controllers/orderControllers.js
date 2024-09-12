const Order = require("../models/orders");
const Cart = require("../models/cart");
const stripe = require("stripe")(
  process.env.STRIPE_KEY
); // Replace with your actual Stripe secret key

exports.createOrder = async (req, res) => {
  const { payment_method_id, shipping_address } = req.body;

  if (
    !shipping_address ||
    !shipping_address.street ||
    !shipping_address.city ||
    !shipping_address.state ||
    !shipping_address.zip ||
    !shipping_address.country
  ) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  try {
    // Fetch the cart for the user
    const cart = await Cart.findOne({ user_id: req.user.id._id });

    // Check if cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Ensure total_price is a valid number and convert to cents
    const amount = Math.round(cart.total_price * 100);
    console.log("Amount to charge:", amount);

    // Create a PaymentIntent with automatic payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "usd",
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Check if the payment requires additional actions
    if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_source_action"
    ) {
      return res
        .status(400)
        .json({
          requires_action: true,
          payment_intent_client_secret: paymentIntent.client_secret,
        });
    }

    // Create and save the order
    const order = new Order({
      user_id: req.user.id._id,
      items: cart.items,
      total_price: cart.total_price, // Use correct field name
      shipping_address: shipping_address, // Ensure this matches the schema structure
      payment_method: "Credit Card", // Assuming all payments are Credit Card for simplicity
      status: "Pending", // Match case and value to schema enum
    });

    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ user_id: req.user.id._id });

    // Respond with success
    res.json({ success: true, order_id: order._id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.getOrders =async (req,res)=>{
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
}