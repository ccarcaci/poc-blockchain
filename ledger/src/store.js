"use strict"

module.exports = {
  initialize: () => {
    let content = {}
    const saveHandler = (newContent) => content = newContent
    const loadHandler = () => content

    return ({
      save: saveHandler,
      load: loadHandler,
    })
  },
}
