const dotenv = require("dotenv")
const process = require("process")

dotenv.config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

module.exports = {
  refNodeUrl: process.env.REF_NODE_URL,
  logLevel: process.env.LOG_LEVEL,
}
