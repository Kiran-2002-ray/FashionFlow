const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    
    // Send the products as JSON
    res.json(products);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};

exports.searchProducts = async(req,res)=>{
  try {
    const searchTerm = req.query.q; // Get the search term from query parameters

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Perform a case-insensitive search on the product name or description fields
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
  
