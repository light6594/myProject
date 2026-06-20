const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authLayout = "../views/layouts/auth.ejs";
const jwtSecret = process.env.JWT_SECRET;

router.get("/register", (req, res) => {
  
  const locals = {
    title: "회원가입",
  };

  res.render("auth/register", { locals, layout: authLayout });
});

router.post("/register", asyncHandler(async (req, res) => {
    
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashedPassword,
    });

    res.redirect("/login");
  })
);

router.get("/login", (req, res) => {
  
  const locals = {
    title: "로그인",
  };

  res.render("auth/login", { locals, layout: authLayout });
});

router.post("/login", asyncHandler(async (req, res) => {
    
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) { return res.status(401).send("아이디가 존재하지 않습니다.");}

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) { return res.status(401).send("비밀번호가 일치하지 않습니다.");}

  const token = jwt.sign({ userId: user._id }, jwtSecret);
  res.cookie("token", token, { httpOnly: true });

  res.redirect("/players");
  })
);

router.get("/logout", (req, res) => {
  
  res.clearCookie("token");
  res.redirect("/");

});

module.exports = router;