"use strict"

const log4js = require("log4js")

const logLevel = "info"
const layout = {
  type: "pattern",
  pattern: "LOGGER\t| %d\t| %p\t| %m%n",
}
const appenders = {
  out: {
    type: "stdout",
    layout: layout,
  },
}
const enabledAppenders = ["out"]
log4js.configure({
  appenders: appenders,
  categories: {
    default: {
      appenders: enabledAppenders,
      level: logLevel,
    },
  },
})

module.exports = log4js.getLogger()
