"use strict"

const store = require("./store")

const currentPage = store.initialize()
const chain = store.initialize()

currentPage.store({
  pageContent: {
    transactions: [ ],
    previousPageHash: "",
    padding: "",
  },
  currentPageHash: "",
})
chain.store([
  currentPage.load()
])

const addPage = (chain, currentPage) => [ currentPage, ...chain ]
const verifyPOW = (pageContent) => sha3(pageContent).slice(0, 1) === "4"
const uuidv4 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (chars) => {
  const random = Math.random() * 16 | 0, value = chars === "x" ? random : (random & 0x3 | 0x8)
  return value.toString(16)
})
const sha3 = (pageContent) => {
  const hash = new SHA3(512)
  hash.update(JSON.stringify(pageContent))
  return hash.digest().toString("hex")
}

module.exports = {
  full: () => chain,
  addTransaction: (transaction) => currentPage.load().transactions = [ transaction, ...currentPage.load().transactions ],
  mine: () => {
    currentPage.padding = uuidv4()
    
    if(verifyPOW(currentPage)) {
      chain.store(addPage(chain, currentPage))
      currentPage.store({
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        currentPageHash: "",
      })
    }
  }
}
