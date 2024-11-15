import express from "express";
import { addComment, deleteComment, replyToComment, toggleLike } from "../controllers/commentController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:postId/comments", authenticateToken, addComment);
router.delete("/comments/:commentId", authenticateToken, deleteComment);
router.post("/comments/:commentId/reply", authenticateToken, replyToComment);
router.post("/:postId/like", authenticateToken, toggleLike);

export default router;