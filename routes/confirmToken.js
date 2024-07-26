const jwt = require("jsonwebtoken");

const confirmToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_CODE, (err, user) => {
      if (err) res.status(403).json("Invalid token!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Authentication denied!");
  }
};

const confirmTokenAndAuthorization = (req, res, next) => {
  confirmToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Authorization rescinded!");
    }
  });
};

const confirmTokenAndAdmin = (req, res, next) => {
  confirmToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Authorization rescinded!");
    }
  });
};

module.exports = {
  confirmToken,
  confirmTokenAndAuthorization,
  confirmTokenAndAdmin,
};
