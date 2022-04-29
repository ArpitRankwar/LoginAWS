//require("dotenv").config();

const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// database connection
/*connection();*/

const db = mysql.createConnection({
  host: "wiinblock.chtpsrziaxhj.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Wiingy123",
  database: "userinfo",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("DATABASE CONNECTED");
});

// middlewares
app.use(express.json());
app.use(cors());

const validate1 = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("username"),
  });
  return schema.validate(data);
};

const validate2 = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("username"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

const validate3 = (data) => {
  const schema = Joi.object({
    country: Joi.string().required().label("country"),
    username: Joi.string().required().label("username"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

// routes

app.post("/api/gmailauth", async (req, res) => {
  try {
    const { error } = validate1(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const username = req.body.username;

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (result.length > 0) {
          const token = jwt.sign(
            { username: result[0].username },
            "thisismycourse",
            {
              expiresIn: "7d",
            }
          );

          return res.status(201).send({
            result: username,
            token: token,
            message: "logged in successfully",
          });
        }
        db.query(
          "INSERT INTO users (username) VALUES (?)",
          [username],
          (err, newuser) => {
            if (err) return res.status(400).send({ message: "Not Possible" });
            const token = jwt.sign(
                { username: username },
                "thisismycourse",
                {
                  expiresIn: "7d",
                }
              );

              return res.status(201).send({
                result: username,
                token: token,
                message: "logged in successfully",
              });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/api/auth", async (req, res) => {
  try {
    const { error } = validate2(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const username = req.body.username;
    const password = req.body.password;

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (!result.length) {
          return res.status(400).send({ message: "Invalid Email or Phone Number" });
        }

        if (result[0].password == null) {
          return res.status(400).send({ message: "Invalid Password" });
        }

        bcrypt.compare(password, result[0].password, (bErr, bResult) => {
          if (bErr) {
            return res.status(400).send({ message: "Invalid Password" });
          }

          if(bResult) 
          {
            const token = jwt.sign(
                { username: result[0].username },
                "thisismycourse",
                {
                  expiresIn: "7d",
                }
              );
    
              return res.status(201).send({
                result: result[0].username,
                token: token,
                message: "logged in successfully",
                bResult: bResult,
              });
          }

          return res.status(400).send({message: "Invalid Password"})
        
        });
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { error } = validate3(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const username = req.body.username;
    const password = req.body.password;
    const country = req.body.country;
    const salt = await bcrypt.genSalt(Number('10'));
	const hashPassword = await bcrypt.hash(password, salt); 

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (result.length) {
          return res.status(400).send({ message: "Email ID or Phone Number Already Exists" });
        }
        db.query(
          "INSERT INTO users (username, password, country) VALUES (?,?,?)",
          [username, hashPassword, country],
          (err, newuser) => {
            if (err) return res.status(400).send({ message: "Not Possible" });
            const token = jwt.sign(
                { username: username },
                "thisismycourse",
                {
                  expiresIn: "7d",
                }
              );

              return res.status(201).send({
                result: username,
                token: token,
                message: "logged in successfully",
              });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/api/updates", async (req, res) => {
  try {
    const { error } = validate2(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const username = req.body.username;
    const password = req.body.password;
    const salt = await bcrypt.genSalt(Number('10'));
	  const hashPassword = await bcrypt.hash(password, salt); 

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (!result.length) {
          return res.status(400).send({ message: "Email ID or Phone Doesn't Exists" });
        }
        db.query(
          "UPDATE users SET password = ? WHERE username = ?",
          [hashPassword, username],
          (err, newuser) => {
            if (err) return res.status(400).send({ message: "Not Possible" });
            const token = jwt.sign(
                { username: username },
                "thisismycourse",
                {
                  expiresIn: "7d",
                }
              );

              return res.status(201).send({
                result: username,
                token: token,
                message: newuser,
              });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
