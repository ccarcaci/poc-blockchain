"use strict"

const http = require("http")
const https = require("https")
const url = require("url")

const detectProtocol = (completeUrl, callback) => {
  if(completeUrl.startsWith("https")) { callback(https) }

  callback(http)
}

// Https Functions

module.exports = {
  doGet: (completeUrl) => new Promise((resolve, reject) => {
    detectProtocol(completeUrl, (protocol) => {
      const request = protocol.get(completeUrl, (response) => {
        let data = ""
        response.on("data", (chunk) => data += chunk)
        response.on("end", () => resolve(JSON.parse(data)))
      })
      request.on("error", (err) => reject(err))
      request.end()
    })
  }),
  doPost: (completeUrl, content) => {
    detectProtocol(completeUrl, (protocol) => {
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

      const request = protocol.request(options)
      request.write(jsonStringContent)
      request.end()
    })
  },
}
