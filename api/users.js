const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getAllUsers } = require("../db");
const { getUserByUsername } = require("../db");
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});



usersRouter.post("/api/users/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("this is req.body", req.body);
 
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {

      const token = jwt.sign(
        { id: 1, username: "albert" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
        
      );
      res.send({ message: "you're logged in!", "token": token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users,
  });
});

module.exports = usersRouter;
