require("dotenv").config({path: __dirname + '/.env'});

module.exports = {
  mongo_url: process.env.MONGO_URL,
  port: process.env.PORT
}
