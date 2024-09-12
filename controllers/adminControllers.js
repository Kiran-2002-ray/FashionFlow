const Products = require("../models/product");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Order = require('../models/orders')
const mongoose = require("mongoose");

exports.products = async (req, res) => {
  try {
    const products = await Products.find();

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.find();
    if (users.lenght === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.categories = async (req, res) => {
  try {
    const categories = await Products.distinct("category");
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addProducts = async (req, res) => {
  try {
    const data = req.body;
    const product = new Products(data);
    await product.save();
    res.status(200).json({ message: "product added" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
};

exports.addUsers = async (req, res) => {
  try {
    const data = req.body;
    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;
    const user = new User(data);
    await user.save();

    res.status(200).json({ message: "user added " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.editProduct = async (req, res) => {
  const productId = new mongoose.Types.ObjectId(req.params.productId);

  try {
    const products = await Products.findById(productId);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

exports.saveEditProduct = async (req, res) => {
  try {
    // Extract the product ID and the data from the request
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const data = req.body;

    console.log("Data received for update:", data);

    // Find the product by ID and update it with the new data
    const updatedProduct = await Products.findByIdAndUpdate(productId, data, {
      new: true, // Return the updated document
      runValidators: true, // Validate the new data against the schema
    });

    // If the product is not found, return a 404 error
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle any errors that occur during the update process
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    // For other errors, return a 500 status code
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);

    // Find and delete the product by ID
    const product = await Products.findByIdAndDelete(productId);

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);

    // Handle errors and return a 500 status code
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports. deleteUser= async (req,res)=>{

  try{
    const userId= new mongoose.Types.ObjectId(req.params.userId);
    const user=await User.findByIdAndDelete(userId);
    if(!user){
      return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User successfully deleted' });
  }
  catch(error){
    return res.status(400).json({ message: 'Invalid user ID' });
  }

} 

exports.orders = async(req,res)=>{
  try{
    const orders =  await Order.find();
    if(orders.length===0){
      return res.status(404).json({ message: 'No orders found' });
    }
    console.log(orders);
    res.status(200).json(orders);

  }catch(error){
    console.log(error);
    return res.status(400).json({ message: 'Invalid user ID' });
  }



}