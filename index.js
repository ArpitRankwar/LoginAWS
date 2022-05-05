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
const validate3 = (data) => {
  const schema = Joi.object({
    Teacher_ID: Joi.string().label("Teacher_ID")
  });
  return schema.validate(data);
};
const validate4 = (data) => {
  const schema = Joi.object({
    Product_ID: Joi.string().label("Product_ID"),
    Student_ID: Joi.string().label("Student_ID"),
    Class_ID: Joi.string().label("Class_ID"),
    Date_Time: Joi.string().label("Date_Time"),
    status: Joi.string().label("status"),
  });
  return schema.validate(data);
};
// routes
app.post("/ProductDetails", async (req, res) => {
  try {
    const { error } = validate4(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Product_ID = req.body.Product_ID;
    const Student_ID = req.body.Product_ID;
    const Class_ID = req.body.Product_ID;
    const Date_Time = req.body.Product_ID;
    const status=req.body.status;
    if(status=0){
      db.query(
        "DELETE FROM Student_Classes WHERE Product_ID = ? and Student_ID = ? and Class_ID = ?",
        [Product_ID,Student_ID,Class_ID],
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          return res.status(201).send({message:"Deleted Successfully"}); 
        }
      );
    }
    if(status=1){
      db.query(
        "INSERT into Student_Classes (Product_ID,Student_ID,Class_ID,Date_Time) Values(?,?,?,?)",
        [Product_ID,Student_ID,Class_ID,Date_Time],
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          return res.status(201).send({message:"Added Successfully"}); 
        }
      );
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
app.post("/StudentDetails", async (req, res) => {
  try {
    const { error } = validate3(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Teacher_ID = req.body.Teacher_ID;
  
    db.query(
      "SELECT * FROM Student_Details WHERE Teacher_ID = ?",
      [Teacher_ID],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        return res.status(201).send(result); 
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
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
        return res.status(201).send(result); 
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
