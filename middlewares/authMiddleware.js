const jwt = require("jsonwebtoken");
const config = require("../config/dev");
const User = require("../models/User");
const { normalizeErrors } = require("../helpers/mongoose");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwtExpired(res, token);

    const user = parseToken(token);
    User.findById(user.userId, function (err, user) {
      if (err) {
        return res.status(422).json({ errors: normalizeErrors(err.errors) });
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return unAuthorized(res);
      }
    });
  } else {
    return unAuthorized(res);
  }
};

function parseToken(token) {
  let tokenValue = token.split(" ")[1];
  let decoded = jwt.verify(tokenValue, config.SECRET);
  return decoded;
}

function unAuthorized(res) {
  return res.status(401).json({
    errors: [
      {
        title: "Not authorized!",
        detail: "You need to login to get access!",
      },
    ],
  });
}

function jwtExpired(res, token) {
  let tokenValue = token.split(" ")[1];
  jwt.verify(tokenValue, config.SECRET, function (err) {
    if (err) {
      res.json(err);
    }
  });

  // if (decodedToken.exp < dateNow.getTime() / 1000) {
  //   res.json({ message: "jwt expired" });
  // }
}
