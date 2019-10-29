module.exports = {
  propagate: (newNodes, sourceNode, knownNodes) => {
    return [ ...newNodes, sourceNode, ...knownNodes ]
  },
}
