"use strict"

const logger = require("./logger")
const store = require("./store")
const crypto = require("./crypto")
const pipe = require("./pipe")

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
const chainingHashInspector = (chain) => {
  if(chain.length <= 1) { return chain }

  for(let index = 0; index < chain.length -1; index++) {
    const currentPageHash = chain[index].pageHash
    const nextPageHash = chain[index + 1].pageContent.previousPageHash

    if(currentPageHash !== nextPageHash) { return undefined }
  }

  return chain
}
const hashVerification = (chain) => {
  for(let index = 0; index < chain.length - 1; index++) {
    const computatedHash = crypto.sha3(chain[index].pageContent)

    if(computatedHash !== chain[index].pageHash) { return undefined }
  }

  return chain
}

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
  inspect: () => pipe(chain.load(), () => true, () => false)(chainingHashInspector,
    hashVerification),
}
