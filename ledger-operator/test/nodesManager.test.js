"use strict"

const client= require("../client")
const nodesManager = require("../nodesManager")

jest.mock("../client")

describe("Propagation Functionalities", () => {
  beforeEach(() => client.doPost.mockReset())

  test("Call propagate returns the concatenation of knownNodes", () => {
    expect(nodesManager.Operations.merge(1, [ 2, 3 ], [ 4, 5, 6 ])).toStrictEqual([ 1, 2, 3, 4, 5, 6 ])
  })
  test("Propagation will remove duplicate nodes", () => {
    expect(nodesManager.Operations.merge(42, [ 42, 1 ], [ 42, 2 ])).toStrictEqual([ 42, 1, 2 ])
  })
  test("Ask to ref node its list of known nodes", (done) => {
    client.doGet.mockResolvedValue([ 42, 4242 ])
    const theCallback = (knownNodes) => {
      expect(knownNodes).toEqual([ 42, 4242 ])
      done()
    }
    nodesManager.Operations.initializeKnownNodes(1, theCallback)
  })
  test("Propagate all nodes", () => {
    client.doPost.mockResolvedValue([])
    nodesManager.Operations.propagate([ 1, 2, 3 ], () => {})
    expect(client.doPost.mock.calls.length).toBe(3)
    expect(client.doPost.mock.calls[0][0]).toStrictEqual(1)
    expect(client.doPost.mock.calls[1][0]).toStrictEqual(2)
    expect(client.doPost.mock.calls[2][0]).toStrictEqual(3)
  })
})

describe("Spot unknown nodes", () => {
  test("Unknown nodes is the caller", () => {
    expect(nodesManager.Operations.unknowns(1, [], [42])).toStrictEqual([1])
  })
  test("Some nodes are unknown", () => {
    expect(nodesManager.Operations.unknowns(1, [ 2, 3, 4 ], [ 1, 2, 42 ])).toStrictEqual([ 3, 4 ])
  })
})
