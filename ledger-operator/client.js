const http = require("http")
const https = require("https")

// Https Functions

const doGet = (completeUrl) => new Promise((resolve, reject) => {
  detectProtocol(completeUrl, (protocol) => {
    const request = protocol.get(completeUrl, (response) => {
      let data = ""
      response.on("data", (chunk) => data += chunk)
      response.on("end", () => resolve(JSON.parse(data)))
    })
    request.on("error", (err) => reject(err))
    request.end()
  })
})
const doPost = (completeUrl, content) => {
  detectProtocol(
  const jsonStringContent = JSON.stringify(content)
  const action = url.parse(completeUrl)

  const options = {
    hostname: action.hostname,
    port: 4443,
    path: action.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": jsonStringContent.length,
    },
  }

  const request = https.request(options)
  request.write(jsonStringContent)
  request.end()
}

const detectProtocol = (completeUrl, callback) => {
  callback(https)
}
