"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")

const logger = require("./logger")
const store = require("./store").initialize()
const chain = require("./chain")
const configs = require("./configs")

store.save([
  {
    pageContent: {
      transactions: [ ],
      previousPageHash: "",
      padding: "",
    },
    pageHash: "",
  },
])

const httpsOptions = {
  // eslint-disable-next-line no-undef
  key: fs.readFileSync(`${__dirname}/../certs/privkey.pem`),
  // eslint-disable-next-line no-undef
  cert: fs.readFileSync(`${__dirname}/../certs/certificate.crt`),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "GET" && action.pathname === "/chain") { getChain(response) }
  else if(request.method === "POST" && action.pathname === "/transaction") { addTransaction(request, response) }
  else if(request.method === "GET" && action.pathname === "/current-page") { getCurrentPage(response) }
  else if(request.method === "GET" && action.pathname === "/inspect") { inspect(response) }
  else if(request.method === "GET" && action.pathname === "/tamper") { tamper(response) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => logger.info(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, () => logger.info(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const rootRoute = (response) => {
  response.writeHead(200)
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}
const getChain = (response) => {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(store.load()))
  response.end()
}
const addTransaction = (request, response) => {
  getBody(request).then((transaction) => {
    store.save(chain.addTransaction(store.load(), transaction))

    response.writeHead(200)
    response.end()
  })
}
const getCurrentPage = (response) => {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(store.load().slice(-1))
  response.end()
}
const inspect = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })

  if(chain.inspect(store.load())) {
    response.write("OK")
  } else {
    response.write("KO")
  }

  response.end()
}
const tamper = () => {}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})

// Mining

setInterval(() => chain.mine(store.load()), configs.miningInterval)
