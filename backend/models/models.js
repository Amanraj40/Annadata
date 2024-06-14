const mongoose = require("mongoose");

const foodGroups = [
  "Non-Perishable Food",
  "Perishable Food",
  "Prepared Food",
  "Baby Food and Formula",
  "Snacks and Beverages",
];
const stock = {
  "Non-Perishable Food": { type: Number, default: 0 },
  "Perishable Food": { type: Number, default: 0 },
  "Prepared Food": { type: Number, default: 0 },
  "Baby Food and Formula": { type: Number, default: 0 },
  "Snacks and Beverages": { type: Number, default: 0 },
};

// ------- User Model -------

// Create schema for Users
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  foodGroup: { type: String, enum: foodGroups, required: true },
  email: { type: String },
  phone: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String },
});

// Create model for Users
const User = mongoose.model("Users", userSchema);

// ------- Donations Model -------

// Create schema for Donations
const foodDonations = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodBanks",
    required: true,
  },
  units: { type: Number, required: true },
  date: { type: String, required: true },
  foodCondition: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Approved", "Denied", "Donated"],
    default: "Pending",
  },
});

// Create model for Donors
const Donations = mongoose.model("Donations", foodDonations);

// ------- Requests Model -------

// Create schema for Patients
const foodRequests = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodBanks",
    required: true,
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  foodGroup: { type: String, enum: foodGroups, required: true },
  units: { type: Number, required: true },
  date: { type: String, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied", "Completed"],
    default: "Pending",
  },
});

// Create model for Patients
const Requests = mongoose.model("Requests", foodRequests);

// ------- Blood Bank Model -------

// Create schema for Blood Banks
const foodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: { type: String, required: true },
  contactPerson: { type: String },
  category: { type: String, required: true },
  website: { type: String },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  requests: [
    {
      requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Requests" },
    },
  ],
  donations: [
    {
      donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donations" },
    },
  ],
  stock: stock,
});

// Create model for Food Banks
const FoodBank = mongoose.model("FoodBanks", foodBankSchema);

// Create schema for Camps
const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  bankId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodBanks" },
  organizer: { type: String, required: true },
  contact: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  donors: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Users", unique: true },
      units: { type: Number, required: true, default: 0 },
      status: { type: Number, enum: [0, 1], default: 0 },
    },
  ],
});

// Create model for Camps
const Camp = mongoose.model("Camps", campSchema);

// Exports
module.exports = { User, Donations, Requests, FoodBank, Camp };