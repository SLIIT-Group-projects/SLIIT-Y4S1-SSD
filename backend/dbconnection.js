// dbConnection.js
const mongoose = require("mongoose");

class DatabaseConnection {
  constructor() {
    if (!DatabaseConnection.instance) {
      this._connect();
      DatabaseConnection.instance = this;
    }
    return DatabaseConnection.instance;
  }

  _connect() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
      });
  }
}

// Ensure the instance is a Singleton
const instance = new DatabaseConnection();
Object.freeze(instance);

module.exports = instance;
