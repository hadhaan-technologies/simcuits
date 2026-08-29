import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

/*
 * GET /api/problems
 * Get all published problems
 */
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find({ status: "published" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("Failed to fetch problems:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
});

/*
 * GET /api/problems/:id
 * Get a single problem
 */
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "author",
      "username email",
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Failed to fetch problem:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
});

export default router;
