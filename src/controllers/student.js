const { student, user, student_grade, grade } = require("../../models");
const joi = require("joi").extend(require("@joi/date"));
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Op } = require("sequelize");

const getPagination = (page, size) => {
  const limit = size ? +size : 4;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.RegisterPage = async (req, res) => {
  try {
    const gradeData = await grade.findAll({
      attrributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.json({ grade: gradeData });

    // res.render("pages/register", {
    //   data: gradeData,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

// exports.getAllStudent = async (req, res) => {
//   try {
//     const { page, size, fullnameSort } = req.query;
//     const { limit, offset } = getPagination(page, size);

//     const userData = await user.findOne({
//       where: {
//         id: req.user.id,
//       },
//       attrributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     const data = await student.findAndCountAll({
//       order: [["fullname", fullnameSort == 0 ? "ASC" : "DESC"]],
//       limit,
//       offset,
//       include: [
//         {
//           model: student_grade,
//           include: [{ model: grade }],
//         },
//       ],
//       attrributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     const { count: totalItems, rows: students } = data;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);

//     // return res.render("pages/dashboard", {
//     //   users: userData,
//     //   moment: moment,
//     //   students: students,
//     //   currentPage: currentPage,
//     //   totalPages: totalPages,
//     //   totalItems: totalItems,
//     // });

//     res.send({
//       message: "success",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       message: "Internal server error!",
//     });
//   }
// };

exports.getAllUser = async (req, res) => {
  try {
    const userData = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await grade.findAll({
      attrributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const data = await student_grade.findAll({
      include: [
        {
          model: grade,
        },
        {
          model: student,
        },
      ],
      attrributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.json({ student: data, user: userData, grade: gradeData });

    // res.render("pages/adminDashboard", {
    //   data: datas,
    //   users: userData,
    //   grades: gradeData,
    //   moment: moment,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

// exports.getAllStudent = async (req, res) => {
//   try {
//     const fullnameSort = req.query.studentID;
//     const studentData = await student.findOne({
//       where: {
//         id: req.student.id,
//       },
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     const datas = await student_grade.findAll({
//       where: {
//         studentID: req.student.id,
//       },
//       include: [
//         {
//           model: grade,
//         },
//         {
//           model: student,
//         },
//       ],
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//       group: ["fullname"],
//     });

//     const allStudentData = await student_grade.findAll({
//       include: [
//         {
//           model: grade,
//         },
//         {
//           model: student,
//         },
//       ],
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//       group: ["fullname"],
//       order: [["studentID", fullnameSort == 0 ? "ASC" : "DESC"]],
//     });

//     res.render("pages/studentDashboard", {
//       student: allStudentData,
//       data: datas,
//       users: studentData,
//       moment: moment,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       message: "Internal server error",
//     });
//   }
// };

exports.getAllStudent = async (req, res) => {
  try {
    const fullnameSort = req.query.fullnameSort;
    const searchQuery = req.query.searchQuery || ""; // Mendapatkan nilai pencarian dari query string, default menjadi string kosong jika tidak ada

    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const datas = await student_grade.findAll({
      where: {
        studentID: req.student.id,
      },
      include: [
        {
          model: grade,
        },
        {
          model: student,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      group: ["fullname"],
    });

    const allStudentData = await student_grade.findAll({
      include: [
        {
          model: grade,
        },
        {
          model: student,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      group: ["fullname"],
    });

    return res.json({ user: studentData, student: allStudentData });

    // res.render("pages/studentDashboard", {
    //   student: allStudentData,
    //   data: datas,
    //   users: studentData,
    //   moment: moment,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.studentProfile = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.json({ student: studentData });

    // res.render("pages/studentEdit", {
    //   users: studentData,
    //   moment: moment,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.StudentRegister = async (req, res) => {
  try {
    const body = req.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    // let age = moment().diff(moment(body.born_date, "YYYY-MM-DD"), "years");

    const schema = joi.object({
      fullname: joi.string().min(3).required(),
      dateOfBirth: joi.date().format("YYYY-MM-DD").utc(),
      address: joi.string().min(3).required(),
      phoneNumber: joi.string().min(11).required(),
      parentName: joi.string().min(3).required(),
      parentNumber: joi.string().min(11).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      gradeName: joi.array().items(joi.string()),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const studentData = {
      fullname: body.fullname,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      phoneNumber: body.phoneNumber,
      parentName: body.parentName,
      parentNumber: body.parentNumber,
      email: body.email,
      password: hashedPassword,
    };

    const dataStudent = await student.create(studentData);

    body.gradeName.forEach(async (grade) => {
      const studentGrade = {
        studentID: dataStudent.id,
        gradeID: grade,
      };
      await student_grade.create(studentGrade);
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.UpdateStudent = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;

    const schema = joi.object({
      fullname: joi.string().min(3).required(),
      dateOfBirth: joi.date().format("YYYY-MM-DD").utc(),
      address: joi.string().min(3).required(),
      phoneNumber: joi.string().min(11).required(),
      parentName: joi.string().min(3).required(),
      parentNumber: joi.string().min(11).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const findStudent = await student.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const studentUpdateRequest = {
      fullname: body.fullname,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      phoneNumber: body.phoneNumber,
      parentName: body.parentName,
      parentNumber: body.parentNumber,
      email: body.email,
      password: body.password,
    };

    await findStudent.update(studentUpdateRequest, {
      where: { id },
    });

    return res.json({ data: findStudent });

    // return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.insertStudent = async (req, res) => {
  try {
    const body = req.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    // let age = moment().diff(moment(body.born_date, "YYYY-MM-DD"), "years");

    const schema = joi.object({
      fullname: joi.string().min(3).required(),
      dateOfBirth: joi.date().format("YYYY-MM-DD").utc(),
      address: joi.string().min(3).required(),
      phoneNumber: joi.string().min(11).required(),
      parentName: joi.string().min(3).required(),
      parentNumber: joi.string().min(11).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      gradeName: joi.array().items(joi.string()),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const studentData = {
      fullname: body.fullname,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      phoneNumber: body.phoneNumber,
      parentName: body.parentName,
      parentNumber: body.parentNumber,
      email: body.email,
      password: hashedPassword,
    };

    const dataStudent = await student.create(studentData);

    body.gradeName.forEach(async (grade) => {
      const studentGrade = {
        studentID: dataStudent.id,
        gradeID: grade,
      };
      await student_grade.create(studentGrade);
    });

    res.redirect("/admin-dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.editStudent = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    // let age = moment().diff(moment(body.born_date, "YYYY-MM-DD"), "years");

    const data = {
      fullname: body.fullname,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      phoneNumber: body.phoneNumber,
      parentName: body.parentName,
      parentNumber: body.parentNumber,
      username: body.username,
      password: body.password,
    };

    const findStudent = await student.findOne({
      where: {
        id: id,
      },
      attrributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const schema = joi.object({
      fullname: joi.string().min(3).required(),
      dateOfBirth: joi.date().format("YYYY-MM-DD").utc(),
      address: joi.string().min(3).required(),
      phoneNumber: joi.string().min(11).required(),
      parentName: joi.string().min(3).required(),
      parentNumber: joi.string().min(11).required(),
      username: joi.string().min(3).required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    await findStudent.update(data, {
      where: { id },
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;

    await student_grade.destroy({
      where: {
        studentID: id,
      },
    });

    await student.destroy({
      where: {
        id,
      },
    });

    return res.status(200).send({
      message: "OK",
    });

    // res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

// Render Grade Page
exports.getMathPage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 1, // Ganti dengan ID kelas Matematika
      },
    });

    if (!gradeData) {
      // Siswa tidak memiliki akses ke kelas Matematika
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to math class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

// Lakukan hal yang sama untuk getSciencePage dan getSocialPage

exports.getSciencePage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 2,
      },
    });

    if (!gradeData) {
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to science class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.getSocialPage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 3,
      },
    });

    if (!gradeData) {
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to social class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.getLiteraturePage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 4,
      },
    });

    if (!gradeData) {
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to literature class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.getMartialArtPage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 5,
      },
    });

    if (!gradeData) {
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to martial art class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.getDancePage = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const gradeData = await student_grade.findOne({
      where: {
        studentID: req.student.id,
        gradeID: 6,
      },
    });

    if (!gradeData) {
      return res.status(400).send({
        message: "You not have access to this class",
      });
    }

    return res.status(200).send({
      message: "Wellcome to dance class",
      user: studentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
