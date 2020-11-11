const Sequelize = require("sequelize");
const express = require("express");
const path = require("path");
const app = express();
const functions = require("./functions");
const bodyparser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require("method-override")("_method"));

//this is the table that we created

app.get("/", (req, res) => {
  res.redirect("/bookmarks");
});

app.delete("/bookmarks/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    // console.log("hello", req.body);
    await user.destroy();
    res.redirect("/bookmarks");
  } catch (ex) {
    next(ex);
  }
});

//this creates new users
app.post("/post-bookmarks", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    // console.log("hello", req.body);
    res.redirect(`/bookmarks/${user.category}`);
  } catch (ex) {
    next(ex);
  }
});

//bookmarks page

app.get("/bookmarks", async (req, res, next) => {
  try {
    const users = await User.findAll();
    const count = functions.categCount(users);
    console.log(count);
    let searchCount = functions.categCounter(users);

    res.send(`
          <html>
            <head>
              <link rel="stylesheet" text/css href="/style.css" />
            </head>
            <body>
            <center>
              <h1>Bookmarks(${users.length})</h1>
            <div>
              <form method='POST' action='/post-bookmarks'>
                <div><input type="text" name='name' placeHolder="Enter Site name" /></div>
                <div><input type="text" name='url' placeHolder="Enter Site URL" /></div>
                <div><input type="text" name='category' placeHolder="Enter Category" /></div>
                <button type='submit'>Save</button>
              </form>
                ${users
                  .map(
                    (user) => `
                <p>
                  <a href='/bookmarks/${user.category}'>
                  ${user.category}(${searchCount})
                  </a>
                </p>
                `
                  )
                  .join("")}
            </div>
            </center>
            </body>
          </html>
        `);
  } catch (ex) {
    next(ex);
  }
});

//this handles all the href tags for categories and redirects it here
app.get("/bookmarks/:category", async (req, res, next) => {
  const curCateg = req.params.category;
  const users = await User.findAll();
  let name_id = functions.name(users, curCateg);
  let namesArr = Object.keys(name_id);
  console.log(namesArr);
  try {
    res.send(`
            <html>
              <head>
                <link rel="stylesheet" text/css href="/style.css" />
              </head>
              <body>
              <center>
                <h1>Bookmarks(${users.length})</h1>
                <div>
                  <button>
                    <a href="/bookmarks/">
                    Back
                    </a>
                  </button>
                </div>
                <div>
                <ul>
                 ${namesArr
                   .map(
                     (name) => `
                 <form method='POST' action='/bookmarks/${name_id[name]}?_method=DELETE'>
                 <li style='list-style-type:none'>
                 <a href='${name}.com'>${name}</a>
                 <button>x</button>
                 </li>
                 </form>`
                   )
                   .join("")}
                   </ul>
                </div>
              </center>
              </body>
            </html>
          `);
  } catch (ex) {
    next(ex);
  }
});

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

//handles the users post, creates and adds the user

const init = async () => {
  try {
    await db.authenticate();
    await syncAndSeed();
    // console.log(await User.findAll());
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("listening to port 3000"));
  } catch (ex) {
    // console.log(ex);
  }
};

init();
