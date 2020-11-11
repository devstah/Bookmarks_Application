const Sequelize = require("sequelize");
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

module.exports = {
  db,
  syncAndSeed,
  models: {
    User,
  },
};
