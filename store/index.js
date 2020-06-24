export const state = () => ({
  searchQueries: []
})

export const mutations = {
  ADD_QUERY(state, q) {
    state.searchQueries.push(q)
  },
  RESET_QUERIES(state) {
    state.searchQueries = []
  }
}
