const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fake Database
let products = [
  { id: 1, name: "PS5 Controller", price: 120 },
  { id: 2, name: "Switch Pro Controller", price: 99 },
];

let cart = [];
let orders = [];

// ------------------- PRODUCTS -------------------
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// ------------------- CART -----------------------
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

app.post("/api/cart", (req, res) => {
  const item = { id: Date.now(), ...req.body };
  cart.push(item);
  res.status(201).json(item);
});

app.delete("/api/cart/:id", (req, res) => {
  cart = cart.filter(item => item.id != req.params.id);
  res.json({ message: "Removed" });
});

// ------------------- ORDERS ----------------------
app.post("/api/orders", (req, res) => {
  const order = {
    id: Date.now(),
    items: cart,
    total: cart.reduce((t, item) => t + item.price * item.qty, 0),
    ...req.body,
  };
  orders.push(order);
  cart = []; // Clear cart
  res.status(201).json(order);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Server Start
app.listen(5000, () => console.log("Backend chạy tại http://localhost:5000"));
