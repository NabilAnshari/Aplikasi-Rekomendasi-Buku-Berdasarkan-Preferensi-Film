import express from "express";
import {
  Register,
  Login,
  Logout,
  getMe,
  updateUser,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controller/Users.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../controller/UserFavorite.js";
import { uploadImageUser } from "../middleware/multer.js";
import {
  recordActivity,
  getTrendingBooks,
} from "../controller/UserActivity.js";
import {
  getRecommendations,
  generateRecommendations,
  resetRecommendations,
} from "../controller/userRecommendation.js";
import { get } from "http";

const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

router.get("/users", verifyToken, verifyAdmin, getAllUsers);

router.patch("/admin/users/:id", verifyToken, verifyAdmin, updateUserByAdmin);
router.delete("/admin/users/:id", verifyToken, verifyAdmin, deleteUserByAdmin);

router.post("/users", uploadImageUser, Register);
router.patch("/users/:id",verifyToken ,uploadImageUser, updateUser);

router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/me", getMe);

router.post("/favorite", addFavorite);
router.get("/favorite/:user_id", getFavorite);
router.delete("/favorite", removeFavorite);

router.post("/books/feedback", recordActivity);
router.get("/books/trending", getTrendingBooks);

router.get("/recommendations/:film/:userId", generateRecommendations);
router.get("/recommendations/:userId", getRecommendations);
router.delete("/recommendations/:userId", resetRecommendations);

export default router;