const jwt = require("jsonwebtoken");
const { user, student } = require("../../models");

exports.authToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!header) {
      return res.status(401).send({
        status: "failed",
        message: "unauthorized",
      });
    }

    let userVerifiedId = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          return res.status(401).send({
            status: "failed",
            message: err.message,
          });
        }
        return user;
      }
    );

    if (userVerifiedId.email == "admin@gmail.com") {
      const userVerified = await user.findOne({
        where: {
          id: userVerifiedId.id,
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      req.user = userVerified.dataValues;
      next();
    } else {
      const studentVerified = await student.findOne({
        where: {
          id: userVerifiedId.id,
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      req.student = studentVerified.dataValues;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
