import express from "express";
import { registerStallOwner, loginStallOwner, getStallOwnerInfo } from "../controllers/stallOwnerController.js";
import stallOwnerAuth from "../middleware/stallOwnerAuth.js";

const stallOwnerRouter = express.Router();

stallOwnerRouter.post("/register", registerStallOwner);
stallOwnerRouter.post("/login", loginStallOwner);
stallOwnerRouter.get("/info", stallOwnerAuth, getStallOwnerInfo);

export default stallOwnerRouter;

