const dotenv = require("dotenv")
const process = require("process")

dotenv.config()

module.exports = {
  ledgerUrl: process.env.LEDGER_URL,
  repoFilename: process.env.REPO_FILENAME,
  minimumTime: Number(process.env.MINIMUM_TIME),
  generatorInterval: Number(process.env.GENERATOR_INTERVAL),
}
