const Sequelize = require("sequelize");
const express = require("express");
const path = require("path");
const app = express();
const functions = require("./functions");
const bodyparser = require("body-parser");
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log("listening to port 3000"));
app.use(express.static(path.join(__dirname, "public")));
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);
// app.get("/style.css", (req, res) =>
//   res.sendFile(path.join(__dirname, "styles.css"))
// );

// const {
//   db,
//   syncAndSeed,
//   models: { User },
// } = require("./db");
// const express = require("express");
// const app = express();

// const createUser = async ({ name, url, category }) => {
//   return await client
//     .query('INSERT INTO "name", "url", "category" VALUES($3) RETURNING *', [
//       name,
//       url,
//       category,
//     ])
//     .rows(1);
// };

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//this is the table that we created

app.get("/", (req, res) => {
  res.redirect("/bookmarks");
});

//
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

//

app.get("/bookmarks", async (req, res, next) => {
  try {
    const users = await User.findAll();

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
                  <input type="text" name='name' placeHolder="Enter Site name" />
                  <input type="text" name='url' placeHolder="Enter Site URL" />
                  <input type="text" name='category' placeHolder="Enter Category" />
                  <button type='submit'>Create</button>
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
  let names = functions.name(users, curCateg);
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
                 ${names
                   .map(
                     (name) => `
                 <li style='list-style-type:none'>
                 <a href='${name}.com'>${name}</a>
                 </li>
                 `
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
    console.log(await User.findAll());
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("listening to port 3000"));
  } catch (ex) {
    // console.log(ex);
  }
};

init();
