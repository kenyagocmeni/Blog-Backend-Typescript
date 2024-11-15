import express from "express";
import {registerUser, loginUser, updateUserProfile, uploadProfilePicture} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import upload from "../config/multerConfig";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", authenticateToken, updateUserProfile);
router.post("/profile/picture", authenticateToken, upload.single("profilePicture"), uploadProfilePicture);

export default router;