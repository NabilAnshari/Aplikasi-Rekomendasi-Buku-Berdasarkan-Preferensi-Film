import UserActivity from "../models/UserActivity.js";

export const recordActivity = async (req, res) => {
  const { book_id, title, authors, cover_url, type } = req.body;

  try {
    let increment = 0;
    if (type === "detail") increment = 0.4;
    if (type === "favorite") increment = 0.6;

    if (!increment) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    let book = await UserActivity.findOne({ where: { book_id } });

    if (book) {
      book.score += increment;
      await book.save();
    } else {
      book = await UserActivity.create({
        book_id,
        title,
        authors: JSON.stringify(authors),
        cover_url,
        score: increment,
      });
    }

    return res.json({ success: true, message: "Feedback updated", book });
  } catch (err) {
    console.error("recordActivity error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTrendingBooks = async (req, res) => {
  try {
    const books = await UserActivity.findAll({
      order: [["score", "DESC"]],
      limit: 10,
    });
    return res.json(books);
  } catch (err) {
    console.error("getTrendingBooks error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
