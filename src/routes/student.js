const express = require("express");
const router = express.Router();
const student = require("../controllers/student");
const { authToken } = require("../middleware/authToken");

// render page
router.get("/register", student.RegisterPage);
router.get("/admin-dashboard", authToken, student.getAllUser);
router.get("/student-dashboard", authToken, student.getAllStudent);
router.get("/student-profile/:id", authToken, student.studentProfile);
router.get("/math-grade", authToken, student.getMathPage);
router.get("/science-grade", authToken, student.getSciencePage);
router.get("/social-grade", authToken, student.getSocialPage);
router.get("/literature-grade", authToken, student.getLiteraturePage);
router.get("/martial-art-grade", authToken, student.getMartialArtPage);
router.get("/dance-grade", authToken, student.getDancePage);

// action
router.post("/sign-up-student", student.StudentRegister);
router.put("/update-student/:id", authToken, student.UpdateStudent);
router.post("/add-student", authToken, student.insertStudent);
// router.post("/edit-student/:id", authToken, student.editStudent);
router.delete("/delete-student/:id", authToken, student.deleteStudent);

module.exports = router;
