import { json, where } from "sequelize";
import { User } from "../db/dbconnection.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../auth/auth.js";
import jwt from "jsonwebtoken";
import { getSecretKeys } from "../utils/environmentVariables.js";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  const existUser = await User.findOne({
    where: {
      username: username,
    },
  });
  if (existUser !== null) {
    console.log(existUser);
    return res.status(409).json({
      message: "Username already exist ",
    });
  } else {
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hasedPassword });
    return res.status(201).json({
      message: "User created sucessfully",
      user: { user },
    });
  }
};

export const loginController = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const exist = await User.findOne({
      where: { username: username },
    });

    if (!exist) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValid = await bcrypt.compare(password, exist.password);

    if (isValid) {
      const accessToken = generateAccessToken(exist);
      const refreshToken = generateRefreshToken(exist);
      exist.update({
        refreshToken: refreshToken,
      });
      res.status(200).json({
        message: "Login Successful",
        user: exist,
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshTokenController = async (req, res) => {
  // First check if req.body exists and has refreshToken
  if (!req.body || !req.body.refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  // Now safely destructure
  const { refreshToken } = req.body;
  try {
    const { refreshSecret } = getSecretKeys();
    jwt.verify(refreshToken, "cdef", async (error, decoded) => {
      if (error) {
        res.status(403).json({
          message: "Invalid token or expired",
        });
      } else {
        const username = decoded.username;
        const exist = await User.findOne({
          where: { username: username },
        });
        const accessToken = generateAccessToken(exist);
        res.status(200).json({
          message: "Sucess",
          accessToken,
        });
      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logoutController = async (req, res) => {
  return res.status(200).json({
    message: "Logout sucessfull",
  });
};

export const getUserProfileController = async (req, res) => {
  const user = req.user;
  const username = user.username;
  const exist = await User.findOne({
    where: { username: username },
  });
  if (exist) {
    return res.status(200).json({
      messsage: "Users",
      user: exist,
    });
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};
