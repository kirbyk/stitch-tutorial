const stitch = require("mongodb-stitch"); // MongoDB Stitch SDK
const chance = require("chance").Chance(); // Package for random variables


// Seeds for the random data
const LOCATIONS = ["Store 1", "Store 2", "Store 3"];
const TOPPINGS = [
  "Pepperoni",
  "Mushrooms",
  "Onions",
  "Sausage",
  "Bacon",
  "Extra cheese",
  "Black olives",
  "Green peppers",
  "Pineapple",
  "Spinach"
];
const SIZES = ["Personal", "Small", "Medium", "Large", "X-tra Large"];


// // Set-up the MongoDB connection
const client = new stitch.StitchClient("charting-zxsyw");
const db = client.service("mongodb", "mongodb-atlas").db("sales-reporting");

// Authenticate anonymously and then begin to load data
// client.login().then(generateReceipts);

// Alternatively, use the API Key to load data more securely
client
  .authenticate(
    "apiKey",
    "oX2BkSYsv9aEnbOwgtFRxi6Up5E3HQCIClcapRNPPYPBS3Vllb0KFB3580yrch5X"
  )
  .then(generateReceipts);

// Send sample data while within this loop
function generateReceipts() {
  // Create a random transaction
  const receipt = {
    timestamp: Date.now(),
    customerName: chance.name({ nationality: "en" }),
    cardNumber: chance.cc(),
    location: chance.weighted(LOCATIONS, [2, 5, 3]),
    size: chance.weighted(SIZES, [1, 2, 3, 4, 5]),
    toppings: chance.weighted(TOPPINGS, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    total: parseFloat(chance.normal({ mean: 20, dev: 3 }).toFixed(2))
  };

  // Print to the console
  console.log(receipt);

  // Insert into MongoDB
  db.collection("receipts").insertOne(receipt).then(
    // Wait for a random amount of time
    setTimeout(generateReceipts, chance.integer({ min: 0, max: 3000 }))
  );
}
