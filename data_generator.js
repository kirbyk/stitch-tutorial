//Set-up the MongoDB connection
const stitch = require('mongodb-stitch')
const client = new stitch.StitchClient('charttime-obqtc');
const db = client.service('mongodb', 'mongodb-atlas').db('SalesReporting');
const salesData = db.collection("Receipts");

//Package for random variables
var chance = require('chance').Chance();

//Seeds for the random data
var loc = ["Store 1", "Store 2", "Store 3"];
var tops = ["Pepperoni", "Mushrooms", "Onions", "Sausage", "Bacon", "Extra cheese", "Black olives", "Green peppers", "Pineapple","Spinach"];
var size = ["Personal", "Small", "Medium", "Large", "X-tra Large"];

/*Send sample data while within this loop*/
function datagen(){
  //Create a random transaction
  var doc = {
    "timestamp" : Date.now(),
    "customerName" : chance.name({nationality: 'en'}),
    "cardNumber" : chance.cc(),
    "location" : chance.weighted(loc, [2, 5, 3]),
    "size" : chance.weighted(size, [1, 2, 3, 4, 5]),
    "toppings" : chance.weighted(tops,[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    "total" : parseFloat(chance.normal({mean: 20, dev: 3}).toFixed(2))
  }

  //Print to the console
  console.log(doc)

  //Insert into MongoDB
  salesData.insertOne(doc).then(
    //Wait for a random amount of time
    setTimeout(datagen, chance.integer({min: 0, max: 3000}))
  );
}

//Authenticate anonymously and then begin to load data
//client.login().then(datagen);

//Alternatively Use the API Key to load data more securely
client.authenticate('apiKey', 'kVItuPn0owg58xK31ebs0Frlt2Rq9Cu66bcDGqCDury6p1NiAdVM1I2f9654HgXy').then(datagen);
