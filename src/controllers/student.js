const { student, user, student_grade, grade } = require("../../models");
const joi = require("joi").extend(require("@joi/date"));
const bcrypt = require("bcrypt");
const moment = require("moment");

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

    res.render("pages/register", {
      data: gradeData,
    });
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

    const datas = await student_grade.findAll({
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
      group: ["fullname"],
    });

    res.render("pages/adminDashboard", {
      data: datas,
      users: userData,
      grades: gradeData,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: {
        id: req.student.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const datas = await student_grade.findAll({
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
      group: ["fullname"],
    });

    res.render("pages/studentDashboard", {
      data: datas,
      users: studentData,
      moment: moment,
    });
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

    res.render("pages/studentEdit", {
      users: studentData,
      moment: moment,
    });
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

    return res.redirect("/");
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

    res.redirect("/");
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

    return res.render("pages/mathematicsPage", {
      users: studentData,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

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

    return res.render("pages/sciencePage", {
      users: studentData,
      moment: moment,
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

    return res.render("pages/socialPage", {
      users: studentData,
      moment: moment,
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

    return res.render("pages/literaturePage", {
      users: studentData,
      moment: moment,
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

    return res.render("pages/martialArtPage", {
      users: studentData,
      moment: moment,
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

    return res.render("pages/dancePage", {
      users: studentData,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
