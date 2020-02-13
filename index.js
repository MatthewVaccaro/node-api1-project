// implement your API here
const express = require("express");
const db = require("./data/db");

const server = express();

const port = 8080;

server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
server.use(express.json());

//Sanitit Checked (Confirmed)
server.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Crap, couldn't get the user's info!" });
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    return res.status(400).json({ message: "Please add a name and bio" });
  } else {
    return db
      .insert(newUser)
      .then(user => {
        return res.status(201).json(newUser);
      })
      .catch(err => {
        return res.status(500).json({
          message:
            "Houston we have a problem, we messed up and didn't save the user info"
        });
      });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved" });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(204).json({ message: "No user was found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const userEidt = req.body;
  const id = req.params.id;

  db.update(id, userEidt)
    .then(user => {
      db.findById(id).then(user => {
        if (user) {
          return res.status(201).json(user);
        } else {
          return res.status(404).json({ message: "user not found" });
        }
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved" });
    });
});
