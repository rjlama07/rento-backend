import jwt from "jsonwebtoken";
import { getSecretKeys } from "../utils/environmentVariables.js";

const generateAccessToken = (user) => {
  const { accessSecret } = getSecretKeys();
  const token = jwt.sign({ username: user.username }, accessSecret, {
    expiresIn: "15min",
  });
  console.log(token);
  return token;
};

const generateRefreshToken = (user) => {
  const { refreshSecret } = getSecretKeys();
  const token = jwt.sign({ username: user.username }, refreshSecret, {
    expiresIn: "7d",
  });
  return token;
};

const authenticateToken = async (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  const { accessSecret } = getSecretKeys();
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, accessSecret, async (error, success) => {
      if (error) {
        res.status(403).json({
          message: "Invalid Token or Expired",
        });
      } else {
        req.user = success;
        next();
      }
    });
  } else {
    res.status(403).json({
      message: "Token not found",
    });
  }
};

export { generateAccessToken, generateRefreshToken, authenticateToken };
