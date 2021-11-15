// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    mongodbKey : process.env.MONGODB_KEY,
    port: process.env.PORT,
    password: process.env.PASSWORD
};