"use strict"

let currentPageContent = getCurrentPageContent()
let currentHash = currentPage.currentPageHash

while(1) {
  const pageContent = addPadding(currentPageContent)
  
  if(verifyProofOfWork(pageContent)) { addPage(pageContent) }

  let newPageHash = getCurrentHash()
  
  if(currentHash !== newPageHash) {
    currentHash = newPageHash
    currentPageContent = getCurrentPageContent()
  }
}

// Miner Functions

const getCurrentPageContent = () => doGet("https://ledger-manager/current-page").pageContent
const addPadding = (pageContent) => pageContent.proofOfWork.padding = randomString()
const verifyProofOfWork = (pageContent) => sha3(pageContent).firstTwoChars === "42"
const addPage = (pageContent) => doPost("https://ledger-manager/add-page", pageContent)
const getCurrentHash = doGet("https://ledger-manager/current-page").currentPageHash

// Https Functions

const doGet = (url) => new Promise((resolve, reject) => https.get(url, (response) => {
  let data = "";
  response.on("data", (chunk) => data += chunk);
  resp.on('end', resolve(data));
}).on("error", (err) => reject(err)))

const doPost = (url, content) => {
  const options = {
    hostname: url.split("/")[0],
    port: 4443,
    path: url.split("/")[1],
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": content.length
    }
  }

  const request = https.request(options)
  request.write(data)
  request.end()
}
