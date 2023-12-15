const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" })
var jwt = require('jsonwebtoken');

const getJWTToken = async function () {
  return jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET);
};

const generatejwtToken = async () => {
  return await getJWTToken();
};

module.exports = { generatejwtToken }
