const changePassword = require("./UserController/changePassword");
const createUser = require("./UserController/createUser")
const getUser = require("./UserController/getUser")
const getUserByEmail = require("./UserController/getUserByMail")
const getUserbypassword = require("./UserController/getUserByPassword")
const loginUser = require("./UserController/login")
const showWelcomeMessage = require("./UserController/showWelcomeMessage")
const updateUserProfile = require("./UserController/updateUserProfile")

module.exports = {
  changePassword,
  createUser,
  getUser,
  getUserByEmail,
  getUserbypassword,
  loginUser,
  showWelcomeMessage,
  updateUserProfile,
};
