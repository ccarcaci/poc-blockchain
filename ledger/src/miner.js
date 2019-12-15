"use strict"

const pipe = require("./pipe")
const page = require("./page")

module.exports = {
  mine: () => {
    return pipe(
        page.getCurrentPageContent(),
        page.addPadding,
        page.verifyPOW)
  }
}
