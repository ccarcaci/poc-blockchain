"use strict"

const store = require("../src/store")

describe("Verify Store Functionality", () => {
  test("Instantiate multiple store and retrieve data", () => {
    const page = store.initialize()
    const chain = store.initialize()

    page.save({ eenie: "meenie" })
    chain.save([ 1, 2, 42 ])

    expect(page.load()).toEqual({ eenie: "meenie" })
    expect(chain.load()).toEqual([ 1, 2, 42 ])
  })
})
