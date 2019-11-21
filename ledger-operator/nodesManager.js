"use strict"

const { doPost } = require("./client")
const { log } = require("./logger")

let knownNodes = []

module.exports = {
  Store: {
    save: (nodes) => knownNodes = nodes,
    load: () => knownNodes,
  },
  Pure: {
    join: (...nodes) => {
      return [...new Set(nodes)]
    },
    merge: (sourceNode, newNodes, knownNodes) => {
      return [...new Set([ sourceNode, ...newNodes, ...knownNodes ])]
    },
    unknowns: (sourceNode, newNodes, knownNodes) => {
      return [...new Set([ sourceNode, ...newNodes ])].filter((node) => !knownNodes.includes(node))
    },
    initializeKnownNodes: (refNode, callback) => {
      doPost(refNode, [])
        .catch((error) => log.error(error))
        .then((knownNodes) => callback(knownNodes))
    },
    propagate: (nodes, callback) => {
      nodes.forEach((node) => doPost(node, [])
        .catch((error) => log.error(error))
        .then((receivedNodes) => callback(receivedNodes)))
    },
  },
}
