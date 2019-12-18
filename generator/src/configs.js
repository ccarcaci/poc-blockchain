const dotenv = require("dotenv")
const process = require("process")

dotenv.config()

module.exports = {
  ledgerUrl: process.env.LEDGER_URL,
  repoFilename: process.env.REPO_FILENAME,
  minimumTime: process.env.MINIMUM_TIME,
  generatorInterval: process.env.GENERATOR_INTERVAL,
}
