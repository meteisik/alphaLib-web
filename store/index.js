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
  RESET_QUERIES(state) {
    state.searchQueries = []
  }
}
