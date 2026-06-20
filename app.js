require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const connectDb = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

connectDb();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use("/", require("./routes/main"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/players"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
