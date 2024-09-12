const Products = require("../models/product");

exports.category = async (req, res) => {
  try {
    const { categoryName } = req.params;
   
    const products = await Products.find({ category: categoryName });
 
    res.json(products);

  } catch (eror) {
    res.status(500).json({ message: eror.message });
  }
};

exports.productDetails = async(req,res)=>{
  try {
    console.log(req.params.id)
    const product = await Products.findById(req.params.id);
  
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

