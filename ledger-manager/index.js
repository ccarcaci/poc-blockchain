"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")

const httpsOptions = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/certificate.crt"),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "GET" && action.pathname === "/ledger") { ledger(response) }
  else if(request.method === "GET" && action.pathname === "/current-page") { currentPage(response) }
  else if(request.method === "POST" && action.pathname === "/add-page") { addPage(request, response) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => console.log(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, () => console.log(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const ledgerExample = [
  {
    pageContent: {
      transactions: [
        {
          payer: "",
          payee: ""
        }
      ],
      previousPageHash: "",
      proofOfWork: {
        padding: ""
      },
    },
    currentPageHash: ""
  }
]

const ledger = []
const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain", })
  response.write("Ledger Manager")
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}

const ledger = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.write(JSON.stringify(ledger))
  response.end()
}
const currentPage = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.write(JSON.stringify(ledger.last()))
  response.end()
}
const addPage = (request, response) => {
  const page = getBody(request)
  const powVerified = verifyPOW(page.page)

  if(powVerified) { response.writeHead(200, { "Content-Type": "text/plain" }) }
  else { response.writeHead(422) }

  response.end()
}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
