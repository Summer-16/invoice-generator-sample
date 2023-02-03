module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      invoiceNo: { type: String, default: '' },
      billTo: { type: Object },
      shipTo: { type: Object },
      ProductList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
      subTotal: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      cgstAmt: { type: Number, default: 0 },
      sgstAmt: { type: Number, default: 0 },
    },
    {
      collection: "invoice",
      autoCreate: true,
      timestamps: true
    }
  );

  const Invoice = mongoose.model("invoice", schema);
  return Invoice;
};
