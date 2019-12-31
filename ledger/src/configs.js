/* eslint-disable no-process-env */

"use strict"

const dotenv = require("dotenv")
const process = require("process")

dotenv.config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

module.exports = {
  miningInterval: process.env.MINING_INTERVAL,
  logLevel: process.env.LOG_LEVEL || "info",
}
