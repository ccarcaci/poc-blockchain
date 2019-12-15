"use strict"

const client = require("../src/client")
const network = require("../src/network")

jest.mock("../src/client")

describe("Propagation Functionalities", () => {
  beforeEach(() => client.doPost.mockReset())

  test("Call propagate returns the concatenation of knownNodes", () => {
    expect(network.merge(1, [ 2, 3 ], [ 4, 5, 6 ])).toStrictEqual([ 1, 2, 3, 4, 5, 6 ])
  })
  test("Propagation will remove duplicate nodes", () => {
    expect(network.merge(42, [ 42, 1 ], [ 42, 2 ])).toStrictEqual([ 42, 1, 2 ])
  })
  test("Ask to ref node its list of known nodes", (done) => {
    client.doGet.mockResolvedValue([ 42, 4242 ])
    const theCallback = (knownNodes) => {
      expect(knownNodes).toEqual([ 42, 4242 ])
      done()
    }
    network.initializeKnownNodes(1, theCallback)
  })
  test("Propagate all nodes", () => {
    client.doPost.mockResolvedValue([])
    network.propagate([ 1, 2, 3 ], () => {})
    expect(client.doPost.mock.calls.length).toBe(3)
    expect(client.doPost.mock.calls[0][0]).toStrictEqual(1)
    expect(client.doPost.mock.calls[1][0]).toStrictEqual(2)
    expect(client.doPost.mock.calls[2][0]).toStrictEqual(3)
  })
})

describe("Spot unknown nodes", () => {
  test("Unknown nodes is the caller", () => {
    expect(network.unknowns(1, [], [42])).toStrictEqual([1])
  })
  test("Some nodes are unknown", () => {
    expect(network.unknowns(1, [ 2, 3, 4 ], [ 1, 2, 42 ])).toStrictEqual([ 3, 4 ])
  })
})

describe("Propagate Mined Page", () => {
  test("Propagate page with POW verified", () => {
    const currentPage = {}
    const nodes = [ 1, 2 ]
    
    network.propagatePage(nodes, currentPage)

    
    expect(client.doPost).toBeCalledTimes(2)
    expect(client.doPost).toBeCalledTimes(2)
  })
})
