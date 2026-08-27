import express from "express";
import multer from "multer";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
} from "../controllers/articleController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getArticles);
router.get("/mine", verifyToken, requireRole("author", "admin"), getMyArticles);
router.get("/:slug", getArticleBySlug);

router.post(
  "/",
  verifyToken,
  requireRole("author", "admin"),
  upload.single("coverImage"),
  createArticle,
);

router.patch(
  "/:id",
  verifyToken,
  requireRole("author", "admin"),
  updateArticle,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("author", "admin"),
  deleteArticle,
);

export default router;
