"use strict"

const { doPost } = require("./client")
const { log } = require("./logger")

let knownNodes = []

module.exports = {
  Store: {
    save: (nodes) => knownNodes = nodes,
    read: () => knownNodes,
  },
  Pure: {
    propagate: (sourceNode, newNodes, knownNodes) => {
      return [ sourceNode, ...newNodes, ...knownNodes ]
    },
    initializeKnownNodes: (refNode, callback) => {
      doPost(refNode, [])
        .catch((error) => log.error(error))
        .then((knownNodes) => callback(knownNodes))
    },
  },
}
