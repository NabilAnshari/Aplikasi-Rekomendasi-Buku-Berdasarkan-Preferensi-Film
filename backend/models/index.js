import db from "../config/Database.js"
import Users from "./UserModel.js";
import Favorite from "./UserFavorite.js";
import Rekomendasi from "./UserRekomendasi.js";

Users.hasMany(Favorite, {foreignKey: "user_id"})
Favorite.belongsTo(Users, {foreignKey: "user_id"})
Rekomendasi.belongsTo(Users, {foreignKey: "user_id"})

export {db, Users, Favorite, Rekomendasi}