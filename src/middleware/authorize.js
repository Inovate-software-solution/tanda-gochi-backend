const authorize = function (req, res, next) {
  const jwt = req.jwt;
  if (!req.headers.authorization) {
    res.status(401).json({
      error: true,
      message: "Unauthorized: Log In is required",
    });
    return;
  } else {
    const auth = req.headers.authorization;
    if (!auth || auth.split(" ").length !== 2) {
      res.status(401).json({
        error: true,
        message: "Unauthorized: Missing or malformed JWT",
      });
      return;
    }
    const token = auth.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.UserData = payload;
      next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({
          error: true,
          message: "Unauthorized: Expired JWT",
        });
      } else {
        return res.status(401).json({
          error: true,
          message: "Unauthorized: Invalid JWT",
        });
      }
    }
  }
};

module.exports = authorize;
