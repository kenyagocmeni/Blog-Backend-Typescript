import express from "express";
import {createBlogPost, updateBlogPost, deleteBlogPost, searchBlogPosts, uploadBlogImage} from "../controllers/blogController";
import { authenticateToken } from "../middleware/authMiddleware";
import upload from "../config/multerConfig";

const router = express.Router();

router.post("/",authenticateToken, createBlogPost);
router.put("/:id",authenticateToken, updateBlogPost);
router.delete("/:id", authenticateToken, deleteBlogPost);
router.get("/search", searchBlogPosts);
router.post("/:id/image", authenticateToken, upload.single("image"), uploadBlogImage);

export default router;