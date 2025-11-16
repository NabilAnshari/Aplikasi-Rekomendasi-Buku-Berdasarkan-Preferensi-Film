import { where } from "sequelize";
import Favorite from "../models/UserFavorite.js";

export const addFavorite = async (req, res) => {
  try {
    const { user_id, book_api } = req.body;
    const favorite = await Favorite.create({ user_id, book_api });
    return res.status(201).json({
      success: true,
      data: favorite,
      msg: "Favorite Added",
    });
  } catch (error) {
    console.error("Error addFavorite:", error);
    return res.status(500).json({ msg: error.message });
  }
};

export const getFavorite = async (req, res) => {
  const { user_id } = req.params;
  try {
    const favorite = await Favorite.findAll({
      where: { user_id: user_id },
    });
    res.status(201).json({ msg: "Favorite Retrieve", data: favorite });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  const { user_id, book_api } = req.body;
  try {
    const favorite = await Favorite.findOne({
      where: { user_id, book_api },
    });
    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }
    await favorite.destroy();
    res.status(200).json({ msg: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
