const Sequelize = require("sequelize");
const routes = require("./routes/routes");
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);
const express = require("express");
const path = require("path"); //what is this for? - Devy
const app = express();
const functions = require("./functions");
const bodyparser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require("method-override")("_method"));

app.use("/bookmarks", routes); //call routes variable here

const User = db.define("User", {
  name: {
    type: STRING,
    allowNull: false,
  },
  url: {
    type: STRING,
    allowNull: false,
  },
  category: {
    type: STRING,
    allowNull: false,
  },
});

const syncAndSeed = async () => {
  await db.sync({ force: true });
  await User.create({
    name: "Stack Overflow ",
    url: "www.stackoverflow.com",
    category: "jobsearch",
  });
  await User.create({
    name: "LinkedIn",
    url: "www.linkedIn.com",
    category: "jobsearch",
  });
  await User.create({
    name: "Indeed",
    url: "www.indeed.com",
    category: "jobsearch",
  });
  await User.create({
    name: "Glassdoor",
    url: "www.glassdoor.com",
    category: "jobsearch",
  });
};

app.get("/", (req, res) => { //only need one route in the main file . the root route
  res.redirect("/bookmarks");
})


const init = async () => {
  try {
    await db.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("listening to port 3000"));
  } catch (ex) {
    console.log(ex);
  }
};

init();
