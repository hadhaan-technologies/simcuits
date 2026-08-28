import Article from "../models/Article.js";
import User from "../models/User.js";

// GET /api/articles?page=1&limit=10&tag=verilog
export async function getArticles(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { tag } = req.query;

    const query = {
      status: "published",
    };

    if (tag) {
      query.tags = tag;
    }

    const articles = await Article.find(query)
      .populate("author", "username")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content");

    const total = await Article.countDocuments(query);

    res.status(200).json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ARTICLES ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch articles",
    });
  }
}

// GET /api/articles/:slug
export async function getArticleBySlug(req, res) {
  const article = await Article.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true },
  ).populate("author", "username");

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json({ article });
}

// POST /api/articles — author or admin only
export async function createArticle(req, res) {
  const { title, subtitle, excerpt, content, tags, status } = req.body;

  const coverImage = req.file ? `/uploads/articles/${req.file.filename}` : "";

  if (!title || !excerpt || !content) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const existing = await Article.findOne({ slug });

  if (existing) {
    return res.status(409).json({
      error: "An article with a similar title already exists",
    });
  }

  const article = await Article.create({
    title,
    subtitle,
    slug,
    excerpt,
    content,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    coverImage,
    author: req.user.id,
    status: status === "published" ? "published" : "draft",
    publishedAt: status === "published" ? new Date() : undefined,
  });

  if (article.status === "published") {
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { articlesPublished: 1 },
    });
  }

  res.status(201).json({ article });
}
// PATCH /api/articles/:id — own author or admin only
export async function updateArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        error: "Article not found",
      });
    }

    // Only the article author or admin can edit
    if (String(article.author) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    const wasPublished = article.status === "published";

    Object.assign(article, req.body);

    // Set publication date when publishing
    if (req.body.status === "published" && !wasPublished) {
      article.publishedAt = new Date();
    }

    // Clear publication date when moved back to draft
    if (req.body.status === "draft") {
      article.publishedAt = undefined;
    }

    await article.save();

    // Update author's published article count
    if (!wasPublished && article.status === "published") {
      await User.findByIdAndUpdate(article.author, {
        $inc: { articlesPublished: 1 },
      });
    } else if (wasPublished && article.status === "draft") {
      await User.findByIdAndUpdate(article.author, {
        $inc: { articlesPublished: -1 },
      });
    }

    return res.status(200).json({
      article,
    });
  } catch (error) {
    console.error("UPDATE ARTICLE ERROR:", error);

    return res.status(500).json({
      error: "Failed to update article",
    });
  }
}

export async function uploadArticleImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded",
      });
    }

    const imageUrl = `${req.protocol}://${req.get(
      "host",
    )}/uploads/articles/${req.file.filename}`;

    res.status(201).json({
      imageUrl,
    });
  } catch (error) {
    console.error("UPLOAD ARTICLE IMAGE ERROR:", error);

    res.status(500).json({
      error: "Failed to upload image",
    });
  }
}

// DELETE /api/articles/:id — own author or admin only
export async function deleteArticle(req, res) {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  if (String(article.author) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (article.status === "published") {
    await User.findByIdAndUpdate(article.author, {
      $inc: { articlesPublished: -1 },
    });
  }

  await article.deleteOne();

  res.json({ message: "Article deleted" });
}

// GET /api/articles/mine — logged-in author's own articles (draft + published)
export async function getMyArticles(req, res) {
  const articles = await Article.find({ author: req.user.id }).sort({
    createdAt: -1,
  });
  res.json({ articles });
}
