const Sequelize = require("sequelize");
const express = require("express");
const path = require("path");
const app = express();
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log("listening to port 3000"));
// app.use(express.static(path.join(__dirname, "public")));
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);

// const createUser = async ({ name, url, category }) => {
//   return await client
//     .query('INSERT INTO "name", "url", "category" VALUES($3) RETURNING *', [
//       name,
//       url,
//       category,
//     ])
//     .rows(1);
// };

//this is the table that we created
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
    name: "google",
    url: "google.com",
    category: "search engine",
  });
  await User.create({
    name: "facebook",
    url: "facebook.com",
    category: "social media",
  });
  await User.create({
    name: "youtube",
    url: "youtube.com",
    category: "video sharing",
  });
  await User.create({
    name: "twitter",
    url: "twitter.com",
    category: "social media",
  });
  //   const book1 =
};

module.exports = {
  db,
  syncAndSeed,
  models: {
    User,
  },
};
