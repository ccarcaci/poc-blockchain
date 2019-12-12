"use strict"

const nodesManager = require("../nodesManager")
const miner = require("../miner")

jest.mock("../miner.js")

describe("Do mining", () => {
  test("Run single failing mining round", () => {
    miner.getCurrentPageContent.mockResolvedValue([])
    miner.addPadding.mockResolvedValue([])
    miner.verifyPOW.mockResolvedValue(false)

    nodesManager.Operations.mine()

    expect(miner.getCurrentPageContent).toBeCalledTimes(1)
    expect(miner.addPadding).toBeCalledTimes(1)
    expect(miner.verifyPOW).toBeCalledTimes(1)
  })
})
