require("dotenv").config();
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/Listing.js");
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data
    await Listing.deleteMany({});
    console.log("🗑️ Existing data cleared");

    // Insert new data
    await Listing.insertMany(initdata.data);
    console.log("✅ Data was initialized");
  } catch (err) {
    console.log("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

main();
