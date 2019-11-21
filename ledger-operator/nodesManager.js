"use strict"

const client = require("./client")
const logger = require("./logger")

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
      const probingInterval = setInterval(() => {
        logger.info("Trying to connect")
        client.doGet(refNode, [])
          .catch((error) => logger.info(error))
          .then((knownNodes) => {
            logger.info("Connected")
            clearInterval(probingInterval)
            callback(knownNodes)
          })
      }, 2000)
    },
    propagate: (nodes, callback) => {
      nodes.forEach((node) => client.doPost(node, [])
        .catch((error) => logger.error(error))
        .then((receivedNodes) => callback(receivedNodes)))
    },
  },
}
