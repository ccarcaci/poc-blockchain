const { propagate } = require("../nodes.manager")

test("Call propagate returns the concatenation", () => {
  expect(propagate([ 1, 2 ], 3, [ 4, 5, 6 ])).toStrictEqual([ 1, 2, 3, 4, 5, 6 ])
})
