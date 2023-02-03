const config = require("../../config.json");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.db.url;
db.invoice = require("./invoice")(mongoose);
db.products = require("./products")(mongoose);

module.exports = db;
