export const state = () => ({
  searchQueries: []
})

export const mutations = {
  ADD_QUERY(state, q) {
    if (!state.searchQueries.map((i) => i.query).includes(q))
      state.searchQueries.push({
        query: q,
        words: q.split(' ')
      })
  },
  REMOVE_QUERY(state, q) {
    const index = state.searchQueries.map((i) => i.query).indexOf(q)
    if (index && !(index < 0)) {
      state.searchQueries.splice(index)
    }
  },
  RESET_QUERIES(state) {
    state.searchQueries = []
  }
}
