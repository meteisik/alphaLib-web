<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="mt-10">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
    </v-col>
    <v-col cols="6" align-self="center" class="text-center">
      <v-autocomplete
        v-model="query"
        :search-input.sync="search"
        :items="hits"
        :loading="isLoading"
        :outlined="!solo"
        :solo="solo"
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
        item-text="_source.meta.title"
        item-value="_source.meta.author"
        placeholder="The meaning of life..."
        return-object
        @keyup.native.enter="doSearch"
      >
      </v-autocomplete>
      <v-btn link :to="'/search?q=' + search" blo>Search</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      isLoading: false,
      solo: false,
      query: '',
      search: '',
      suggestions: null
    }
  },
  mounted() {
    console.log(this.$router)
  },
  computed: {
    hits() {
      if (this.suggestions === null) return []
      if (Object.keys(this.suggestions).includes('hits'))
        if (Object.keys(this.suggestions.hits).includes('hits'))
          return this.suggestions.hits.hits
      return []
    }
  },
  watch: {
    search(val) {
      console.log(val)
      this.querySuggestions(val)
    }
  },
  methods: {
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
    }
  }
}
</script>
