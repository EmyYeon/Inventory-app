/**
 * StAuth10244: I Yunyu Yang, 000912334 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("products.db");

db.serialize(() => {
db.run("DROP TABLE IF EXISTS Products");
db.run("CREATE TABLE Products( name TEXT, price REAL, quantity INTEGER, category TEXT)");

// Insert some sample data
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Apple", 0.5, 100, "Fruits"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Banana", 0.3, 150, "Fruits"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Carrot", 0.2, 200, "Vegetables"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Broccoli", 0.4, 80, "Vegetables"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Chicken", 5.0, 50, "Meat"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Beef", 7.0, 30, "Meat"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Milk", 1.0, 120, "Dairy"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Cheese", 2.5, 60, "Dairy"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Bread", 1.5, 200, "Bakery"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Butter", 3.0, 40, "Bakery"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Eggs", 0.2, 300, "Dairy"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Yogurt", 0.8, 150, "Dairy"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Ice Cream", 4.0, 80, "Dairy"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Fish", 6.0, 70, "Seafood"]);
db.run("INSERT INTO Products VALUES (?, ?, ?, ?)", [ "Shrimp", 8.0, 40, "Seafood"]);
});