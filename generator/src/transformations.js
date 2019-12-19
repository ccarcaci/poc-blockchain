"use strict"

const stream = require("stream")

const isValidJSON = (content) => {
  try {
    JSON.parse(content)

    return true
  } catch(exception) {
    return false
  }
}

let partialPost = ""

module.exports = {
  splittingLine: new stream.Transform({
    transform(chunk, _, callback) {
      console.log("Splitting line")
      chunk.toString().split("\n")
        .forEach((line) => this.push(line))
      callback()
    },
  }),
  makeValid: new stream.Transform({
    transform(chunk, _, callback) {
      partialPost = `${partialPost}${chunk}`

      if(!isValidJSON(partialPost)) { callback(); return }

      console.log("Make valid Json")
      this.push(partialPost)
      partialPost = ""
      callback()
    },
  }),
  wait: (minimumTime, generatorInteval) => new stream.Transform({
    transform(chunk, _, callback) {
      const waitingTime = minimumTime + Math.random() * generatorInteval
      console.log(`Waiting ${waitingTime}`)

      setTimeout(() => {
        this.push(chunk)
        callback()
      }, waitingTime)
    },
  }),
}
