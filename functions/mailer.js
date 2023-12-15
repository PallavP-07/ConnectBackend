const nodemailer = require("nodemailer");
const user = "tripathishalini789@gmail.com";
const password = "ydpenxbmsireboxk";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: password,
  },
});

var mailOptions = {
  from: user,
  to: "",
  subject: "",
  text: "",
};

const setMailData = (to, subject, text) => {
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.text = text;
};

const SendMail = (to, subject, text) => {
  console.log(to, subject, text);
  setMailData(to, subject, text);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
      console.log("Email Sent Successfully...", info.response);
      return info;
    }
  });
};

var updateData = {
  from: user,

  to: "",

  subject: "",

  text: "",
};

const setUsersDetails = async (to, subject, text) => {
  console.log("Tow", to);

  updateData.to = to;

  updateData.subject = subject;

  updateData.text = text;
};

const updateDetails = async (
  to,
  subject = "Personal Details Updated ",
  text = "Hello, you updated your  personal details successfully...."
) => {
  await setUsersDetails(to, subject, text);

  transporter.sendMail(updateData, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent Successfully...", info.response);

      return info;
    }
  });
};

var updateRole = {
  from: user,

  to: "",

  subject: "",

  text: "",
};

const setUpdateRole = (to, subject, text) => {
  updateRole.to = to;

  updateRole.subject = subject;

  updateRole.text = text;
};

const UpdateRole = (
  to,
  subject ,
  text 
) => {
  setUpdateRole(to, subject, text);

  transporter.sendMail(updateRole, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent Successfully...", info.response);

      return info;
    }
  });
};

var userAccess = {
  from: user,
  to: "",
  subject: "",
  text: "",
};

const setUserAccess = (to, subject, text) => {
  userAccess.to = to;
  userAccess.subject = subject;
  userAccess.text = text;
};

const UserAccess = (
  to,
  subject ,
  text 
) => {
  setUserAccess(to, subject, text);

  transporter.sendMail(userAccess, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent Successfully...", info.response);

      return info;
    }
  });
};

module.exports = {
  SendMail, UpdateRole,UserAccess,updateDetails
};
