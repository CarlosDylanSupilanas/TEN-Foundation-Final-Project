import * as bagModel from "../models/bagModel.js";
import ValidationError from "../utils/ValidationError.js";

export const fetchAllBags = async () => {
  return await bagModel.fetchAllBags();
};

export const createBag = async (bag) => {
  // Required fields
  if (
    !bag.productName ||
    !bag.productCode ||
    !bag.category ||
    !bag.color ||
    bag.quantity === undefined ||
    bag.quantity === ""
  ) {
    throw new ValidationError(400, "Please fill in all fields.");
  }

  // Quantity must be 0 or more
  if (Number(bag.quantity) < 0) {
    throw new ValidationError(400, "Quantity cannot be negative.");
  }

  // Product code must be unique
  const existing = await bagModel.findBagByCode(bag.productCode);
  if (existing.length > 0) {
    throw new ValidationError(409, "This product code already exists.");
  }

  return await bagModel.insert(bag);
};

export const deleteBag = async (id) => {
  const existing = await bagModel.findBagById(id);
  if (existing.length === 0) {
    throw new ValidationError(404, "Bag does not exist!");
  }
  return await bagModel.remove(id);
};

export const updateBag = async (id, bag) => {
  if (
    !bag.productName ||
    !bag.productCode ||
    !bag.category ||
    !bag.color ||
    bag.quantity === undefined ||
    bag.quantity === ""
  ) {
    throw new ValidationError(400, "Please fill in all fields.");
  }

  if (Number(bag.quantity) < 0) {
    throw new ValidationError(400, "Quantity cannot be negative.");
  }

  const existing = await bagModel.findBagById(id);
  if (existing.length === 0) {
    throw new ValidationError(404, "Bag does not exist!");
  }

  // The code must be unique, but the bag may keep its own code
  const sameCode = await bagModel.findBagByCode(bag.productCode);
  if (sameCode.length > 0 && sameCode[0].id !== Number(id)) {
    throw new ValidationError(409, "This product code already exists.");
  }

  return await bagModel.update(id, bag);
};

export const shipBag = async (id, quantity) => {
  const amount = Number(quantity);

  // Must be a positive whole number
  if (!Number.isInteger(amount) || amount < 1) {
    throw new ValidationError(400, "Quantity must be a whole number of 1 or more.");
  }

  const rows = await bagModel.findBagById(id);
  if (rows.length === 0) {
    throw new ValidationError(404, "Bag does not exist!");
  }

  const bag = rows[0];

  
  if (amount > bag.quantity) {
    throw new ValidationError(400, "Not enough stock. Available: " + bag.quantity);
  }

  const done = await bagModel.ship(bag, amount);
  if (!done) {
    throw new ValidationError(400, "Not enough stock.");
  }

  return id;
};