"use strict"

const client = require("./client")
const logger = require("./logger")
const miner = require("./miner")

let knownNodes = []

module.exports = {
  Store: {
    save: (nodes) => knownNodes = nodes,
    load: () => knownNodes,
  },
  Operations: {
    join: (...nodes) => {
      return [...new Set(nodes)]
    },
    merge: (sourceNode, newNodes, knownNodes) => {
      return [...new Set([sourceNode, ...newNodes, ...knownNodes])]
    },
    unknowns: (sourceNode, newNodes, knownNodes) => {
      return [...new Set([sourceNode, ...newNodes])].filter((node) => !knownNodes.includes(node))
    },
    initializeKnownNodes: (refNode, callback) => {
      client.doGet(refNode, [])
        .then((knownNodes) => {
          logger.info("Connected")
          callback(knownNodes)
        })
        .catch((error) => {
          logger.info(error)
          setTimeout(() => initializeKnownNodes(refNode, callback), 2000)
        })
    },
    propagate: (nodes, callback) => {
      nodes.forEach((node) => client.doPost(node, [])
      .then((receivedNodes) => callback(receivedNodes))
      .catch((error) => logger.error(error)))
    },
    mine: () => {
      const currentPageContent = miner.getCurrentPageContent()
      miner.addPadding(currentPageContent)
      miner.verifyPOW(currentPageContent)
    }
  }
}
