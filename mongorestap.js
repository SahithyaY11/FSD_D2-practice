const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MongoDB connection
const mongoURL = "YOUR_MONGODB_ATLAS_CONNECTION_STRING";

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });


// Student Schema
const studentSchema = new mongoose.Schema({

    rollNumber: {
        type: String,
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    marks: {
        type: Number,
        required: true
    }

});

const Student = mongoose.model("Student", studentSchema);


// ================================
// HOME PAGE
// ================================

app.get("/", async (req, res) => {

    try {

        const students = await Student.find();

        res.render("index", {
            students: students
        });

    } catch (error) {

        res.status(500).send("Unable to load student records");

    }

});


// ================================
// CREATE STUDENT
// ================================

app.post("/students", async (req, res) => {

    try {

        const student = new Student({

            rollNumber: req.body.rollNumber,

            studentName: req.body.studentName,

            department: req.body.department,

            marks: req.body.marks

        });

        const savedStudent = await student.save();

        res.status(201).json({

            message: "Student added successfully",

            student: savedStudent

        });

    } catch (error) {

        res.status(400).json({

            message: "Failed to add student",

            error: error.message

        });

    }

});


// ================================
// READ ALL STUDENTS
// ================================

app.get("/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.json(students);

    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch students"

        });

    }

});


// ================================
// READ ONE STUDENT
// ================================

app.get("/students/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        res.json(student);

    } catch (error) {

        res.status(400).json({

            message: "Invalid student ID"

        });

    }

});


// ================================
// UPDATE STUDENT
// ================================

app.put("/students/:id", async (req, res) => {

    try {

        const updatedStudent =
            await Student.findByIdAndUpdate(

                req.params.id,

                {
                    rollNumber: req.body.rollNumber,
                    studentName: req.body.studentName,
                    department: req.body.department,
                    marks: req.body.marks
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedStudent) {

            return res.status(404).json({

                message: "Student not found"

            });

        }


        res.json({

            message: "Student updated successfully",

            student: updatedStudent

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to update student",

            error: error.message

        });

    }

});


// ================================
// DELETE STUDENT
// ================================

app.delete("/students/:id", async (req, res) => {

    try {

        const deletedStudent =
            await Student.findByIdAndDelete(req.params.id);


        if (!deletedStudent) {

            return res.status(404).json({

                message: "Student not found"

            });

        }


        res.json({

            message: "Student deleted successfully"

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to delete student"

        });

    }

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});