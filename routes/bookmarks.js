const Sequelize = require("sequelize");
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/books_db"
);

const app = require("express").Router();
module.exports = app;
// const {
//   db,
//   synchAndSeed,
//   models: { User },
// } = require("./db");

const functions = require("./functions");

//this is the table that we created

// app.get("/", (req, res) => {
//   res.redirect("/bookmarks");
// });

app.delete("/:id", async (req, res, next) => {
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

app.get("/", async (req, res, next) => {
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
app.get("/:category", async (req, res, next) => {
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
