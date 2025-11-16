import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findOne({
      where: { refresh_token: refreshToken }, // pakai findOne
    });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = user.id;
      const name = user.name;
      const email = user.email;
      const role = user.role; // ⬅ tambahkan role
      const image_link = user.image_link; // opsional, kalau mau ikut dibawa

      const accessToken = jwt.sign(
        { userId, name, email, role, image_link }, // ⬅ payload lebih lengkap
        process.env.ACCESS_TOKEN_SECRET, // fix typo
        { expiresIn: "30m" } // jangan terlalu singkat, 15s terlalu cepat expired
      );

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
