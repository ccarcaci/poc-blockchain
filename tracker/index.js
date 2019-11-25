"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const dns = require("dns")

const httpsOptions = {
  // eslint-disable-next-line no-undef
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  // eslint-disable-next-line no-undef
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if (action.pathname === "/") { rootRoute(response) }
  else if (request.method === "GET" && action.pathname === "/track") { track(request, response) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, "0.0.0.0", () => console.log(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, "0.0.0.0", () => console.log(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.write("Try with /track")
  response.end()
}
const track = (request, response) => {
  const remoteAddress = request.socket.remoteAddress
  dns.reverse(remoteAddress, (error, hostnames) => {
    if (error) {
      console.log(error)
      response.writeHead(500, { "Content-Type": "application/json" })
      response.end()
    }
    operators = storeOperators(hostnames[0])

    response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify({ operators }))
    response.end()
  })
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}

// Server Functions

const storeOperators = (operatorAddress) => operators.length === 0 ?
  [operatorAddress]
  : [ operators.pop(), operatorAddress ]

let operators = []
