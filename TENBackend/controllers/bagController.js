import * as bagService from "../services/bagService.js";

export const getBags = async (req, res) => {
  try {
    const bags = await bagService.fetchAllBags();
    res.json(bags);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addBag = async (req, res) => {
  try {
    const id = await bagService.createBag(req.body);
    res.status(201).json({ message: "Bag added.", id: id });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const editBag = async (req, res) => {
  try {
    await bagService.updateBag(req.params.id, req.body);
    res.json({ message: "Bag updated." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const removeBag = async (req, res) => {
  try {
    await bagService.deleteBag(req.params.id);
    res.json({ message: "Bag deleted." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const shipBag = async (req, res) => {
  try {
    await bagService.shipBag(req.params.id, req.body.quantity);
    res.json({ message: "Shipment recorded." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};