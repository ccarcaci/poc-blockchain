"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const { Store, Pure } = require("./nodes.manager")
const { log } = require("./logger")

const config = {}

const httpsOptions = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/certificate.crt"),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "POST" && action.pathname === "/new-nodes") { addNodesAndPropagate(request, response) }
  else { fallbackRoute(response) }
}

const refNodeUrl = config.REF_NODE_URL

Pure.initializeKnownNodes(refNodeUrl, (knownNodes) => {
  Store.save(knownNodes)
  const httpServer = http.createServer((req, res) => routing(req, res))
  const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

  httpServer.listen(httpPort, () => log.info(`HTTP Server on port ${httpPort}`))
  httpsServer.listen(httpsPort, () => log.info(`HTTPS Server on port ${httpsPort}`))
})

// Routing Functions

const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}
const addNodesAndPropagate = async (request, response) => {
  const newNodes = await getBody(request)
  const knownNodes = Store.read()
  const allNodes = Pure.propagate(request.url, newNodes, knownNodes)

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(allNodes))
  response.end()
}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
