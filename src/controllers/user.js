const { user, student } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

exports.Register = async (req, res) => {
  try {
    const body = req.body;

    const schema = joi.object({
      username: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await user.create({
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const body = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    if (body.email === "admin@gmail.com") {
      let findUser = await user.findOne({
        where: {
          email: body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!findUser) {
        return res.status(400).send({
          message: "Email or password doesn't match!",
        });
      }

      const matchUserPassword = bcrypt.compare(
        body.password,
        findUser.password
      );

      if (!matchUserPassword) {
        return res.status(400).send({
          message: "Email or password doesn't match!",
        });
      }

      if (findUser) {
        const userAccessToken = jwt.sign(
          { id: findUser.id, email: findUser.email },
          process.env.ACCESS_TOKEN_SECRET
        );

        return res.json({ userAccessToken });

        // const userData = {
        //   email: findUser.email,
        //   token: userAccessToken,
        // };

        // return res.status(200).send({
        //   message: "login success",
        //   data: userData,
        // });
      }
    } else {
      let findStudent = await student.findOne({
        where: {
          email: body.email,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!findStudent) {
        return res.status(400).send({
          message: "Email or password doesn't match!",
        });
      }

      const matchStudentPassword = bcrypt.compare(
        body.password,
        findStudent.password
      );

      if (!matchStudentPassword) {
        return res.status(400).send({
          message: "Email or password doesn't match!",
        });
      }

      if (findStudent) {
        const studentAccessToken = jwt.sign(
          { id: findStudent.id, email: findStudent.email },
          process.env.ACCESS_TOKEN_SECRET
        );

        return res.json({ studentAccessToken });

        // const studentData = {
        //   email: findStudent.email,
        //   token: studentAccessToken,
        // };

        // return res.status(200).send({
        //   message: "login success",
        //   data: studentData,
        // });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
