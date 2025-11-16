// controller/Users.js
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }

    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role", "image_link"],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Users.findByPk(decoded.userId, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "image",
        "image",
        "image_link",
      ],
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    return res.status(403).json({ msg: "Invalid token" });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  const image = req.file;
  let userImage;
  if (image) {
    userImage = image.filename;
  } else {
    userImage = "default-image.jpg";
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const role = "user";
  try {
    await Users.create({
      name,
      email,
      role,
      password: hashPassword,
      image: userImage,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });


    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role; 
    const image_link = user.image_link; 

    const accessToken = jwt.sign(
      { userId, name, email, role, image_link },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { userId, name, email, role, image_link },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: userId, name, email, role, image_link },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Decoded user from token:", req.user);
    console.log("Params id:", req.params.id);

    if (req.user.userId !== parseInt(id)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: you can only update your own profile" });
    }

    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { name, email, currPassword, newPassword, confPassword } = req.body;
    const image = req.file;
    let userImage = user.image;

    if (image) {
      userImage = image.filename;

      if (user.image && user.image !== "default-image.jpg") {
        const imagePath = path.join(
          __dirname,
          "../public/images/user",
          user.image
        );
        fs.unlink(imagePath, (error) => {
          if (error) {
            console.error("Error deleting image:", error);
          } else {
            console.log("Image deleted successfully");
          }
        });
      }
    }

    let hashPassword = user.password;
    if (newPassword || confPassword) {
      if (!currPassword) {
        return res.status(400).json({ msg: "Current password is required" });
      }

      const match = await bcrypt.compare(currPassword, user.password);
      if (!match)
        return res.status(400).json({ msg: "Wrong current password" });

      if (newPassword !== confPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }

      const salt = await bcrypt.genSalt();
      hashPassword = await bcrypt.hash(newPassword, salt);
    }

    await Users.update(
      {
        name: name || user.name,
        email: email || user.email,
        password: hashPassword,
        image: userImage,
      },
      { where: { id: user.id } }
    );

    res.status(200).json({ msg: "Update Berhasil" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  try {
    const user = await Users.findOne({
      where: { refresh_token: token },
    });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = user.id;
      const name = user.name;
      const email = user.email;
      const role = user.role;
      const image_link = user.image_link;

      const accessToken = jwt.sign(
        { userId, name, email, role, image_link },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await Users.findOne({ where: { refresh_token: token } });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User not found or already logged out" });
    }
    await Users.update({ refresh_token: null }, { where: { id: user.id } });
    return res.status(200).json({ msg: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
    });

    res.json({ msg: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }

    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.destroy();
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
