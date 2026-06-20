const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Player = require("../models/Player");

const playerLayout = "../views/layouts/player.ejs";
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = (req, res, next) => {
  
  const token = req.cookies.token;

  if (!token) { res.redirect("/login");} 
  else { 
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } 
    catch (error) {
      res.redirect("/login");
    }
  }
};

router.get("/players", checkLogin, asyncHandler(async (req, res) => {
    
  const locals = {
      title: "선수 목록",
    };

    const data = await Player.find({ user: req.userId }).sort({ createdAt: "desc" });

    res.render("players/index", {
      locals,
      data,
      layout: playerLayout,
    });
  })
);

router.get("/add", checkLogin, asyncHandler(async (req, res) => {
    
    const locals = {
      title: "선수 추가",
    };

    res.render("players/add", { locals, layout: playerLayout });
  })
);

router.post("/add", checkLogin, asyncHandler(async (req, res) => {
    
  await Player.create({
      user: req.userId,
      name: req.body.name,
      position: req.body.position,
      number: req.body.number,
      team: req.body.team,
      memo: req.body.memo,
    });

    res.redirect("/players");
  })
);

router.get("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    
  const locals = {
      title: "선수 수정",
  };

  const data = await Player.findOne({ _id: req.params.id, user: req.userId });

  res.render("players/edit", {
    locals,
    data,
    layout: playerLayout,
    });
  })
);

router.put("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    
  await Player.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        name: req.body.name,
        position: req.body.position,
        number: req.body.number,
        team: req.body.team,
        memo: req.body.memo,
      }
    );

    res.redirect("/players");
  })
);

router.delete("/delete/:id", checkLogin, asyncHandler(async (req, res) => {
    
  await Player.deleteOne({ _id: req.params.id, user: req.userId });
    res.redirect("/players");
  
  })
);

module.exports = router;