"use strict"

module.exports = {
  initialize: () => {
    let content = {}

    return ({
      save: (newContent) => content = newContent,
      load: () => content,
    })
  },
}
