const Product = require("../../../Models/CropImage");

const getproductdetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const products = await Product.find({ userId });

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

module.exports = getproductdetails;
