"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const dotenv = require("dotenv")
const { Store, Pure } = require("./nodesManager")
const { log } = require("./logger")
const { __dirname } = require("node")

dotenv.config()

const config = require("process").env
const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
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
  const knownNodes = Store.load()

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(knownNodes))
  response.end()

  const newNodes = await getBody(request).catch((error) => log.error(error))
  const unknownNodes = Pure.unknowns(request.url, newNodes, knownNodes)

  if(unknownNodes.size <= 0) { return }

  const allNodes = Pure.merge(request.url, newNodes, knownNodes)
  Pure.propagate(allNodes, (receivedNodes) => Store.save(Pure.join(receivedNodes, allNodes)))
}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
