const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const productRoutes = require("./api/routes/products");
// const orderRoutes = require("./api/routes/orders");
// const cart = require("./api/routes/Cart");
// const user = require("./api/routes/user");

const CONNECTION =
  process.env.MONGODB_URI ||
  "mongodb+srv://harshit:Fn5j1Br5H6d6J0dt@cluster0.ckaid.mongodb.net/node-shop?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("db connected..!");
};

connectDB();

//4.11.o

// mongoose.connect('mongodb://localhost:27017/node-shop', (err) => {
//     if (!err)
//         console.log('MongoDB connection succeeded.');
//     else
//         console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
// })

//mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/cart", cart);
// app.use("/user", user);

// app.use((req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });
console.log("welcome node");

// app.get('/',(req,res)=>{
//   //res.send('in')
//   res.sendFile(__dirname+'/idex.html');
// })

// const db = require('./db.json');
// app.get('/db', (req, res) => {
//   // res.sendFile(__dirname + '/index.html')
//   res.send(db);
// })
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
