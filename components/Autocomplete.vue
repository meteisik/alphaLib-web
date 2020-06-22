<template>
  <v-autocomplete
    v-model="query"
    :search-input.sync="search"
    :items="hits"
    :loading="isLoading"
    :outlined="!solo"
    :solo="solo"
    clearable
    rounded
    single-line
    auto-select-first
    autofocus
    cache-items
    full-width
    prepend-inner-icon="mdi-magnify"
    color="primary"
    hide-no-data
    hide-selected
    item-text="_source.path.real"
    item-value="_source.path.virtual"
    placeholder="The meaning of life..."
    return-object
    @keyup.enter="doSearch"
  ></v-autocomplete>
</template>

<script>
export default {
  name: 'HitAutoComplete',
  data() {
    return {
      isLoading: false,
      solo: false,
      query: '',
      search: '',
      suggestions: null,
      route: ''
    }
  },
  computed: {
    hits() {
      if (this.suggestions === null) return ['Not Specified']
      if (Object.keys(this.suggestions).includes('hits'))
        if (Object.keys(this.suggestions.hits).includes('hits'))
          // console.log(this.suggestions.hits.hits)
          return this.suggestions.hits.hits
      return []
    }
  },
  watch: {
    search(val) {
      console.log('from hitauto' + val)
      this.querySuggestions(val)
    },
    $route(to, from) {
      // react to route changes...
      console.log('to' + to)
      console.log('from' + from)
    },
    route() {
      this.searchUp(this.$route.params.search)
    }
  },
  methods: {
    // //objectParse(array) {
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //   console.log(array[index]);
    // }
    // },
    async lookUp(el) {
      const q = this.query
      const res = await this.$axios.post('/api/literature/_search', {
        explain: true,
        sort: ['_score'],
        query: {
          multi_match: {
            query: q,
            type: 'bool_prefix',
            fields: ['content', 'meta.*']
          }
        }
      })
      this.search = res.data
    },
    async querySuggestions(q) {
      this.isLoading = true
      const suggestions = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          _source: ['path'],
          query: {
            multi_match: {
              query: q,
              type: 'bool_prefix',
              fields: ['meta', 'content']
            }
          },
          highlight: {
            type: 'unified',
            order: 'score',
            fields: {
              content: { number_of_fragments: 200 }
            }
          }
        })
        .then((res) => {
          // let string = JSON.stringify(res.data.hits.hits.highlight)
          console.log(res.data.hits)
          this.items = res.data.hits
          return res.data
        })
        .catch((e) => {
          console.log(e)
          return {}
        })
      this.isLoading = false
      this.suggestions = suggestions
    },
    doSearch() {
      this.$router.push('/search?q=' + this.search)
      this.route = '/search?q=' + this.search
    }
  }
}
</script>
