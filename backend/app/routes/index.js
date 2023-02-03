module.exports = app => {

  const router = require("express").Router();
  const invoice = require("../controllers/invoice");
  const products = require("../controllers/products");

  router.get("/products", products.list);
  router.post("/genInvoice", invoice.create);

  app.use("/", router);
};
