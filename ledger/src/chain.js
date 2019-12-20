"use strict"

const logger = require("./logger")
const store = require("./store")
const crypto = require("./crypto")

const chain = store.initialize()

chain.save([
  {
    pageContent: {
      transactions: [ ],
      previousPageHash: "",
      padding: "",
    },
    pageHash: "",
  },
])

const addPage = (chain, newPage) => [ ...chain, newPage ]

module.exports = {
  full: () => chain.load(),
  addTransaction: (transaction) => {
    const currentPage = chain.load()
      .slice(-1)
      .pop()
      .pageContent
    currentPage.transactions = [ transaction, ...currentPage.transactions ]
  },
  mine: () => {
    const currentChain = chain.load()
    const currentPage = currentChain
      .slice(-1)
      .pop()
    if(currentPage.pageContent.transactions.length <= 0) { return }

    currentPage.pageContent.padding = crypto.uuidv4()
    currentPage.pageHash = crypto.sha3(currentPage.pageContent)

    logger.info(`Mining, current POW: ${currentPage.pageHash}`)

    if(crypto.verifyPOW(currentPage.pageHash)) {
      const newPage = {
        pageContent: {
          transactions: [ ],
          previousPageHash: currentPage.pageHash,
          padding: "",
        },
        pageHash: "",
      }

      chain.save(addPage(currentChain, newPage))
    }
  },
}
