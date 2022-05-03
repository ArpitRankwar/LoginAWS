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
  database: "TP",
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
    Teacher_Name: Joi.string().label("Teacher_Name"),
    Name: Joi.string().label("Name"),
    Password: Joi.string().label("Password"),
  });
  return schema.validate(data);
};
const validate2 = (data) => {
  const schema = Joi.object({
    username: Joi.string().label("username"),
    password: Joi.string().label("password"),
  });
  return schema.validate(data);
};
// routes
app.post("/LogIn", async (req, res) => {
  try {
    const { error } = validate2(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const username = req.body.username;
    const password = req.body.password;

    db.query(
      "SELECT * FROM Teacher_Details WHERE UserName = ? and Passwords=? ",
      [username,password],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (!result.length) {
          return res.status(400).send({ message: "Invalid Email or Phone Number" });
        }
        return res.status(201).send({
          result: result[0].username,
          message: result,
        }); 
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
app.post("/SignUp", async (req, res) => {
  try {
    const { error } = validate1(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Name = req.body.Name;
    const Password = req.body.Password;
    const Teacher_Name = req.body.Teacher_Name;

    db.query(
      "SELECT * FROM Teacher_Details WHERE UserName = ?",
      [Name],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (result.length) {
          return res.status(400).send({ message: "Email ID or Phone Number Already Exists" });
        }
        db.query(
          "INSERT INTO Teacher_Details (Teacher_Name, UserName, Passwords) VALUES (?,?,?)",
          [Teacher_Name, Name, Password],
          (err, newuser) => {
            if (err) return res.status(400).send({ message: "Not Possible" });
              return res.status(201).send({
                result: Name,
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
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
