module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      amount: { type: Number, default: 0 },
      description: { type: String, default: '' },
      dsin: { type: String, default: '' },
      hsn: { type: String, default: '' },
      gst: { type: Number, default: 0 },
      unit: { type: String, default: '' },
      discount: { type: Number, default: 0 },
    },
    {
      collection: "products",
      autoCreate: true,
      timestamps: true
    }
  );

  const Products = mongoose.model("products", schema);
  return Products;
};
