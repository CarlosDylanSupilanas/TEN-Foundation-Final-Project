import express from "express";
import * as bagController from "../controllers/bagController.js";

const router = express.Router();

router.get("/", bagController.getBags);
router.post("/", bagController.addBag);
router.put("/:id", bagController.editBag);
router.delete("/:id", bagController.removeBag);
router.post("/:id/ship", bagController.shipBag);

export default router;
