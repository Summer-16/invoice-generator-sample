const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors');
const db = require("./app/db");
const config = require("./config.json");
const product = require("./app/controllers/products")

app.use(cors({
  origin: '*' // For dev env only, on prod url should be added
}));

// parse requests of content-type - application/json
app.use(express.json({
  limit: '1mb'
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  limit: '1mb',
}));

app.use(express.static(path.resolve("app/www")));

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.info("Connected to the MongoDb database!");
    product.bootStrap(); // This function is used to add the default list of products in the DB when app runs for the first time, Added to save insertion time as it is sample project
  })
  .catch(err => {
    console.error("Cannot connect to the MongoDb database!", err);
    process.exit();
  });

require("./app/routes")(app);

// set port, listen for requests
const PORT = config.app.port;
app.listen(PORT, function () {
  console.info(`App listening at ${PORT}`);
});

// ========== process error handling [ start ] ==========
process.on('uncaughtException', err => {
  console.error("'uncaughtException' occurred! \n error:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
});
// ========== process error handling [ end ] ==========