"use strict"

const client = require("./client")
const logger = require("./logger")

module.exports = {
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
}
