import jwt from "jsonwebtoken";

//  Verify Token (semua user) 
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log("Decoded token:", decoded); 
    req.user = decoded; 
    next();
  });
};

// ===== Verify Admin (khusus admin) =====
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Akses hanya untuk admin" });
    }
    req.user = decoded; 
    next();
  });
};
