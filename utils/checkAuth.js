import jwt from "jsonwebtoken";

// middleware - checkAuth
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  // if no token -> undefined -> to prevent return ""

  // if token -> need to decode it
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      next(); // middleware -> to proceed to next function
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    // If no token (add return to avoid reaching other code)
    return res.status(403).json({
      message: "No access",
    });
  }
};
