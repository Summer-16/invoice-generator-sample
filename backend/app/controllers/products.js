const db = require("../db");
const Products = db.products;
const defaultList = require("../../product.json");

// get list of products
exports.list = async (req, res) => {
  try {

    const { id } = { ...req.params, ...req.body };
    const filter = {};

    if (id) {
      filter._id = id;
    }

    const result = await Products.find(filter);
    return res.json({ success: true, message: "", data: result });

  } catch (err) {
    console.error("Error in Product list", err);
    return res.json({ success: false, message: err.message || "An error occurred in getting Product list" });
  }
}

// This function is used to add the default list of products in the DB when app runs for the first time, Added to save insertion time as it is sample project
exports.bootStrap = async () => {
  try {

    const result = await Products.find({});
    if (result.length === 0) {
      await Products.insertMany(defaultList);
    }
  } catch (err) {
    console.error("Error in Product list bootStrap", err);
  }
}