let store = {
  content,
  save: (newContent) => content = newContent,
  load: () => content
}

module.exports = {
  initialize: () => {
    store.content = {}
    return store
  }
}
