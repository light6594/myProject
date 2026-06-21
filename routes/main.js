const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";

router.get(["/", "/home"], (req, res) => {
  
  const locals = {
    title: "축구 선수단 구성 및 관리",
  };

  res.render("index", { locals, layout: mainLayout });
});

module.exports = router;