import express from "express";
import { uploadArticleImage } from "../middleware/upload.js";
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

router.get("/", getArticles);
router.get("/mine", verifyToken, requireRole("author", "admin"), getMyArticles);
router.get("/:slug", getArticleBySlug);

router.post(
  "/",
  verifyToken,
  requireRole("author", "admin"),
  uploadArticleImage.single("coverImage"),
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
