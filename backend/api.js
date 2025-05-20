/**
 * StAuth10244: I Yunyu Yang, 000912334 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const app = express();
app.use(express.json());
let db; 

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8081' // Only allow React Native Web app
}));

async function api_start() {
  db = await sqlite.open({
    filename: "products.db",
    driver: sqlite3.Database
  });
}
api_start();

// GET request to /api
app.get("/api", async function(req, res){
  try {
    const results = await db.all("SELECT rowid as id, * FROM Products");
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to fetch collection."});
  }
});

// PUT request to /api collection
app.put("/api", async function(req, res){
  try {
    for (let i = 0; i < req.body.length; i++) {
      await db.run("UPDATE Products SET name=?, price=?, quantity=?, category=? WHERE rowid=?",
        [req.body[i].name, req.body[i].price, req.body[i].quantity, req.body[i].category, req.body[i].id]);
    }
    res.json({status: "REPLACE COLLECTION SUCCESSFUL"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to replace collection."});
  }
});

// POST request to /api
app.post("/api", async function(req, res){
  try {
    const result = await db.run("INSERT INTO Products VALUES (?, ?, ?, ?)",
    [req.body.name, req.body.price, req.body.quantity, req.body.category]);
    res.json({status: "CREATE ENTRY SUCCESSFUL", id: result.lastID});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to create new Item."});
  }
});

// DELETE request to /api
app.delete("/api", async function(req, res){
  try {
    await db.run("DELETE FROM Products");
    res.json({status: "DELETE COLLECTION SUCCESSFUL"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to delete collection."});
  }
});

// GET request to /api/:id
app.get("/api/:id", async function(req, res){
  const result = await db.get("SELECT rowid as id, * FROM Products WHERE rowid=?", [req.params.id]);  
  console.log("Row: ", result);
  res.json(result);
});

// PUT request to /api/:id
app.put("/api/:id", async function(req, res){
  try {
    await db.run("UPDATE Products SET name=?, price=?, quantity=?, category=? WHERE rowid=?",
      [req.body.name, req.body.price, req.body.quantity, req.body.category, req.params.id]);
    res.json({status: "UPDATE ITEM SUCCESSFUL", id: req.params.id});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to update item."});
  }
  
});

// DELETE request to /api/:id
app.delete("/api/:id", async function(req, res){
  try {
    await db.run("DELETE FROM Products WHERE rowid=?", [req.params.id]);
    res.json({status: "DELETE ITEM SUCCESSFUL", id: req.params.id});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "ERROR", error: "Failed to delete item."});
  }
});

app.listen(3001, function() {
  console.log("Server is running on port 3001");
});

