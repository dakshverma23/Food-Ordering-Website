import stallOwnerModel from "../models/stallOwnerModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register Stall Owner
const registerStallOwner = async (req, res) => {
    try {
        const { name, email, password, stallName, phone } = req.body;

        // Check if email already exists
        const existingEmail = await stallOwnerModel.findOne({ email });
        if (existingEmail) {
            return res.json({ success: false, message: "Email already exists" });
        }

        // Check if stall name already exists
        const existingStall = await stallOwnerModel.findOne({ stallName });
        if (existingStall) {
            return res.json({ success: false, message: "Stall name already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new stall owner
        const newStallOwner = new stallOwnerModel({
            name,
            email,
            password: hashedPassword,
            stallName,
            phone
        });

        await newStallOwner.save();

        // Generate token
        const token = jwt.sign({ id: newStallOwner._id, stallName: newStallOwner.stallName }, "jwt_secret_key");

        res.json({ success: true, token, stallOwner: { id: newStallOwner._id, name: newStallOwner.name, stallName: newStallOwner.stallName } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering stall owner" });
    }
};

// Login Stall Owner
const loginStallOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        const stallOwner = await stallOwnerModel.findOne({ email });
        if (!stallOwner) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, stallOwner.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: stallOwner._id, stallName: stallOwner.stallName }, "jwt_secret_key");

        res.json({ success: true, token, stallOwner: { id: stallOwner._id, name: stallOwner.name, stallName: stallOwner.stallName } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in" });
    }
};

// Get Stall Owner Info
const getStallOwnerInfo = async (req, res) => {
    try {
        const stallOwner = await stallOwnerModel.findById(req.userId);
        if (!stallOwner) {
            return res.json({ success: false, message: "Stall owner not found" });
        }
        res.json({ success: true, data: { name: stallOwner.name, email: stallOwner.email, stallName: stallOwner.stallName, phone: stallOwner.phone } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching stall owner info" });
    }
};

export { registerStallOwner, loginStallOwner, getStallOwnerInfo };

