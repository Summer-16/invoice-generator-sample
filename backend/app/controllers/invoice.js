const { nanoid } = require("nanoid");
const db = require("../db");
const { createInvoice } = require("../utils/createInvoice");
const Invoice = db.invoice;
const Products = db.products;

// controller to generate invoice
exports.create = async (req, res) => {
  try {
    const { productList, billTo, shipTo } = req.body;

    if (!productList || productList.length === 0) {
      throw new Error("productsList must be provided");
    }
    if (!billTo) {
      throw new Error("billTo must be provided");
    }
    if (!shipTo) {
      throw new Error("shipTo must be provided");
    }

    let products = await Products.find().where('_id').in(productList)
    products = JSON.parse(JSON.stringify(products));

    const productArray = [];
    let subTotal = 0, total = 0, cgstAmt = 0, sgstAmt = 0;
    for (const product of products) {
      const tax = product.gst / 2;
      const amount = product.discount ? (product.amount - (product.amount * (product.discount / 100))) : product.amount;
      subTotal = subTotal + amount;
      cgstAmt = cgstAmt + (amount * (tax / 100));
      sgstAmt = sgstAmt + (amount * (tax / 100));
      productArray.push({
        'sNo': 1,
        'description': product.description + "\n SKU: " + product.dsin,
        'hsn': product.hsn,
        'qty': 1,
        'rate': product.amount,
        'discount': product.discount || 0,
        'cgstPer': tax,
        'cgstAmt': cgstAmt,
        'sgstPer': tax,
        'sgstAmt': sgstAmt,
        'amount': amount
      })
    }

    total = subTotal + cgstAmt + sgstAmt;
    const invoiceId = nanoid(8);
    const invoice = new Invoice({
      invoiceNo: invoiceId,
      billTo: billTo,
      shipTo: shipTo,
      ProductList: productList,
      subTotal: subTotal,
      total: total,
      cgstAmt: cgstAmt,
      sgstAmt: sgstAmt,
    })

    const result = await invoice.save();

    const invoiceConfig = {
      invoiceNo: invoiceId,
      billTo: billTo,
      shipTo: shipTo,
      items: productArray,
      total: total,
      subTotal: subTotal,
      cgstTotal: cgstAmt,
      sgstTotal: sgstAmt
    };
    return createInvoice(invoiceConfig, res)
    // return res.json({ success: true, message: "New Invoice created", data: result });
  } catch (err) {
    console.error("Error in create Invoice", err);
    return res.json({ success: false, message: err.message || "An error occurred in create Invoice" });
  }
}