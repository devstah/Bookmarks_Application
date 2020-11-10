const Sequelize = require("sequelize");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
// app.listen(port, () => console.log("listening to port 3000"));
app.use(express.static(path.join(__dirname, "public")));
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);

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

app.get("/bookmarks", async (req, res, next) => {
  try {
    const users = await User.findAll();
    console.log(users);
    res.send(`
        <html>
          <head>
            <link rel="stylesheet" type="text/css" href="/style.css" />
          </head>
          <body>
          <center>
            <form>
              <div><input type="text" placeHolder="Enter Site name" /></div>
              <div><input type="text" placeHolder="Enter Site URL" /></div>
              <div><input type="text" placeHolder="Enter Category" /></div>
              <button>Save</button>
              <a href=''
            </form>
          </center>
          </body>
        </html>
      `);
  } catch (ex) {
    next(ex);
  }
  c;
});

const init = async () => {
  try {
    await db.authenticate();
    await syncAndSeed();
    // console.log(await User.findAll());
    app.listen(port, () => console.log("listening to port 3000"));
  } catch (ex) {
    // console.log(ex);
  }
};

init();
// const init = async () => {};
