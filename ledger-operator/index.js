"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const { propagate } = require("./nodes.manager")

const httpsOptions = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/certificate.crt"),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "POST" && action.pathname === "/new-nodes") { addNodesAndPropagate(request, esponse) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => console.log(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, () => console.log(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const addNodesAndPropagate = async (request, response) => {
  const nodes = await getBody(request)

  knownNodes = propagate(nodes, request.url, knownNodes)

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(knownNodes))
  response.end()
}

// Server Functions
const knownNodes = []
const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
