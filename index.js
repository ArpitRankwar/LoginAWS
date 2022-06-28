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
  host: "wiingyadmin.chtpsrziaxhj.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Wiingy123",
  database: "WiingyData",
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
    Product_ID: Joi.string().label("Product_ID")
  });
  return schema.validate(data);
};

const validate5 = (data) => {
  const schema = Joi.object({
    Product_ID: Joi.string().label("Product_ID"),
    Student_ID: Joi.string().label("Student_ID"),
    Class_ID: Joi.string().label("Class_ID"),
    Date_Time: Joi.string().label("Date_Time"),
    Teacher_ID: Joi.string().label("Teacher_ID"),
    Quiz_Score: Joi.string().label("Quiz_Score"),
    status: Joi.string().label("status"),
    Entry_Time: Joi.string().label("Entry_Time"),
  });
  return schema.validate(data);
};
const validate6 = (data) => {
  const schema = Joi.object({
    Student_ID: Joi.string().label("Student_ID"),
  });
  return schema.validate(data);
};
const validate7 = (data) => {
  const schema = Joi.object({
    Product_ID: Joi.string().label("Product_ID"),
    Student_ID: Joi.string().label("Student_ID"),
    Class_ID: Joi.string().label("Class_ID"),
    status: Joi.string().label("status"),
  });
  return schema.validate(data);
};

const validate8 = (data) => {
  const schema = Joi.object({
    TeacherID: Joi.string().label("TeacherID"),
    ChildID: Joi.string().label("ChildID"),
    CourseID: Joi.string().label("CourseID"),
    Joining_Date: Joi.string().label("Joining_Date"),
    Joining_Time: Joi.string().label("Joining_Time"),
  });
  return schema.validate(data);
};


app.post("/meetlog", async (req, res) => {
  try {
    const { error } = validate8(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const TeacherID = req.body.TeacherID;
    const ChildID = req.body.ChildID;
    const CourseID = req.body.CourseID;
    const Joining_Date = req.body.Joining_Date;
    const Joining_Time = req.body.Joining_Time;
      db.query(
        "insert into Teacher_Meet_Logs values(?,?,?,?,?)",
        [TeacherID,CourseID,ChildID,Joining_Date,Joining_Time],
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

// routes
app.post("/extractclass", async (req, res) => {
  try {
    const { error } = validate6(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const Student_ID = req.body.Student_ID;
      db.query(
        "Select* FROM Student_Classes WHERE StudentID = ?",
        [Student_ID],
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          var a=result.length;
        db.query(  
        "Update course_sell set Delivered_Classes=? WHERE ChildID= ?",
        [a,Student_ID],
        
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          console.log(a);
        }
        );
          return res.status(201).send(result); 
          }
          

        
      );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/updateassignDetails", async (req, res) => {
  try {
    const { error } = validate7(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Product_ID = req.body.Product_ID;
    const Student_ID = req.body.Student_ID;
    const Class_ID = req.body.Class_ID;
    const status=req.body.status;
    if(status==="true"){
      db.query(
        "UPDATE Student_Classes set Assignment_Status=? where (ClassID=? and ProductID=? and StudentID=?)",
        [1,Class_ID,Product_ID,Student_ID],
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          return res.status(201).send(result); 
        }
      );
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/updateDetails", async (req, res) => {
  try {
    const { error } = validate5(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Product_ID = req.body.Product_ID;
    const Student_ID = req.body.Student_ID;
    const Class_ID = req.body.Class_ID;
    const Date_Time = req.body.Date_Time;
    const Teacher_ID = req.body.Teacher_ID;
    const Quiz_Score= req.body.Quiz_Score;
    const status=req.body.status;
    const Entry_Time=req.body.ENtry_Time;
    if(status==="true"){
      db.query(
        "INSERT into Student_Classes (ClassID,ProductID,StudentID,Quiz_Score,Date_Time,TeacherID,Entry_Time) Values(?,?,?,?,?,?,?)",
        [Class_ID,Product_ID,Student_ID,Quiz_Score,Date_Time,Teacher_ID,Entry_Time],
        (err, result) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          return res.status(201).send(result); 
        }
      );
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// routes
app.post("/ProductDetails", async (req, res) => {
  try {
    const { error } = validate4(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Product_ID = req.body.Product_ID;
  
    db.query(
      "SELECT class_product_details.ClassID, class_details.Class_Name,class_details.PPT_Link,class_details.Quiz_Link FROM class_product_details INNER JOIN class_details ON class_product_details.ClassID=class_details.ClassID WHERE class_product_details.ProductID=? order by class_product_details.SINO",
      [Product_ID],
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
app.post("/StudentDetails", async (req, res) => {
  try {
    const { error } = validate3(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const Teacher_ID = req.body.Teacher_ID;
  
    db.query(
      "SELECT course_sell.ChildID, kiddetails.ChildName,course_sell.ProductID,course_sell.Course_Name,kiddetails.ChildGrade,course_sell.Max_Classes,course_sell.Delivered_Classes,kiddetails.MeetLink,course_sell.ProductID FROM course_sell INNER JOIN kiddetails ON course_sell.ChildID=kiddetails.ChildID WHERE course_sell.TeacherID=?",
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
      "SELECT * FROM teacher_details WHERE username = ? and passwordt=?  ",
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
      "SELECT * FROM Teacher_Details WHERE username = ?",
      [Name],
      (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        if (result.length) {
          return res.status(400).send({ message: "Email ID or Phone Number Already Exists" });
        }
        db.query(
          "INSERT INTO Teacher_Details (Teacher_Name, username, passwordt) VALUES (?,?,?)",
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
