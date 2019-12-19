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
      chunk.toString().split("\n").forEach(line => this.push(line))
      callback()
    }
  }),
  makeValid: new stream.Transform({
    transform(chunk, _, callback) {
      partialPost = `${partialPost}${chunk}`

      if(!isValidJSON(partialPost)) { callback(); return }
      
      this.push(partialPost)
      partialPost = ""
      callback()
    }
  }),
  wait: (minimumTime, generatorInteval) => new stream.Transform({
    transform(chunk, _, callback) {
      const waitingTime = minimumTime + Math.random() * generatorInteval

      setTimeout(() => {
        this.push(chunk)
        callback()
      }, waitingTime)
    }
  }),
}
