import UserRekomendasi from "../models/UserRekomendasi.js";
import axios from "axios";

export const generateRecommendations = async (req, res) => {
  try {
    const { film, userId } = req.params;

    const response = await axios.get(`http://127.0.0.1:8000/recommend/${film}`);
    const recommendations = response.data.recommendations;

    const existing = await UserRekomendasi.findAll({
      where: { user_id: userId },
      attributes: ["book_id"],
    });
    const existingBookIds = new Set(existing.map(rec => rec.book_id));

    const newRecs = recommendations.filter(rec => !existingBookIds.has(rec.id));
    for (const rec of newRecs) {
      await UserRekomendasi.create({
        user_id: userId,
        book_id: rec.id,
      });
    }
    res.status(200).json({ msg: "successful generate recommendations" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await UserRekomendasi.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]],
      attributes: ["book_id"],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const resetRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    await UserRekomendasi.destroy({
      where: { user_id: userId },
    });
    res.status(200).json({ msg: "Recommendations reset successful" });
  } catch (error) {
    console.error(error);
  }
};
