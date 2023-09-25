/**
 *
 * @param {Array} scopes Array of scopes to check for
 * @returns a middleware function that checks for a valid JWT and scope
 */
const authorize = function (scopes) {
  return (req, res, next) => {
    // Check for authorization header key
    const jwt = req.jwt;
    if (!req.headers.authorization) {
      res.status(401).json({
        error: true,
        message: "Unauthorized: Log In is required",
      });
      return;
    }

    // Check for proper format of authorization header value
    const auth = req.headers.authorization;
    if (!auth || auth.split(" ").length !== 2) {
      res.status(401).json({
        error: true,
        message: "Unauthorized: Missing or malformed JWT",
      });
      return;
    }

    // Verify JWT
    const token = auth.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // Check if JWT contains required scopes
      for (const e of scopes) {
        if (!payload.Scopes.includes(e)) {
          return res
            .status(401)
            .json({
              error: true,
              message: `Unauthorized: This API endpoint requires ${e} to access`,
            });
        }
      }

      req.body = { ...req.body, ...payload };
      next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        console.log(e.message);
        res.status(401).json({
          error: true,
          message: "Unauthorized: Expired JWT",
        });
        return;
      } else {
        console.log(e.message);
        res.status(401).json({
          error: true,
          message: "Unauthorized: Invalid JWT",
        });
        return;
      }
    }
  };
};

export default authorize;
