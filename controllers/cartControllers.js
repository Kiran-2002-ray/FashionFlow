const Cart = require("../models/cart"); // Path to your Cart model
const Product = require("../models/product");
const mongoose = require("mongoose"); // Path to your Product model

exports.add = async (req, res) => {
  try {
    const user_id = req.user.id._id;
    const { product_id, quantity } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find and update the cart
    const cart = await Cart.findOneAndUpdate(
      { user_id },
      {
        $addToSet: {
          items: {
            product_id,
            name: product.name,
            quantity,
            unit_price: product.price,
          },
        },
        $inc: { total_price: product.price * quantity },
        updated_at: Date.now(),
      },
      { new: true, upsert: true }
    );

    // Ensure the cart's total price is recalculated accurately
    if (cart) {
      cart.total_price = cart.items.reduce(
        (total, item) => total + item.unit_price * item.quantity,
        0
      );
      await cart.save();
    }

    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "An error occurred while adding to cart" });
  }
};

exports.getCartData = async (req, res) => {
  try {
    const user_id = req.user.id._id;

    // Fetch the cart and populate the product details
    const cart = await Cart.findOne({ user_id })
      // .populate("items.product_id")
      // .lean() // Convert to plain JS object
      // .exec();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Convert ObjectId to string in items
    cart.items = cart.items.map(item => ({
      ...item,
      product_id: item.product_id._id.toString(),
    }));
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cart data" });
  }
};

exports.remove = async (req, res) => {
  try {
    // Convert user_id and productId to ObjectId
    const user_id = req.user.id._id;
    const productId = new mongoose.Types.ObjectId(req.params.productId);

    // Find the user's cart and remove the item with the specified product ID
    const cart = await Cart.findOneAndUpdate(
      { user_id },
      { $pull: { items: { product_id: productId } } },
      { new: true }
    );

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found or item not in cart" });
    }

    // Recalculate the total price after removing the item
    cart.total_price = cart.items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.id._id;
    const productId = new mongoose.Types.ObjectId(req.body.product_id);
    const quantity = req.body.quantity;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart's items array
    const itemIndex = cart.items.findIndex((item) =>
      item.product_id.equals(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Recalculate the total price after updating the item
    cart.total_price = cart.items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
