/* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <v-autocomplete
      v-model="query"
      :search-input.sync="search"
      :items="items"
      :loading="isLoading"
      :outlined="!solo"
      :solo="solo"
      clearable
      rounded
      single-line
      autofocus
      full-width
      prepend-inner-icon="mdi-magnify"
      color="primary"
      hide-no-data
      hide-selected
      placeholder="The meaning of life..."
      item-text="_source.meta.title"
      item-value="_source.meta.title"
      return-object
      @keyup.enter="doSearch"
    >
      <tempate v-slot:no-data>
        <v-list-item-title>
          {{ 'Not Specified' }}
        </v-list-item-title>
      </tempate>
      <template v-slot:item="{ item }">
        <v-icon color="grey">fas fa-list</v-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ 'Title: ' + item._source.meta.title }}
          </v-list-item-title>
          <v-list-item-subtitle>{{
            'Author: ' + item._source.meta.url
          }}</v-list-item-subtitle>
          <v-list-item-subtitle :key="item._id">
            <ul>
              <li
                v-for="phrase in item.highlight.content"
                :key="phrase"
                v-html="phrase"
              ></li>
            </ul>
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
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
      route: '',
      items: []
    }
  },
  computed: {
    hits() {
      if (this.suggestions === null) {
        return ['Not Specified']
      }
      if (Object.keys(this.suggestions).includes('hits')) {
        if (Object.keys(this.suggestions.hits).includes('hits')) {
          return this.suggestions.hits.hits
        }
      }
      return []
    }
  },
  //   q() {
  //     return {
  //       search: null
  //     }
  //   }
  // },
  watch: {
    search(val) {
      console.log(val)
      this.querySuggestions(val)
    },
    // $route(to, from) {
    //   // react to route changes...
    //
    // },
    route() {
      // this works because it reloads after the function fails, not sure how to make it legal
      // this.searchUp(this.$route.params.search)
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
    // clickHandler() {
    //   console.log('fired 1')
    //   this.$root.$on('searchbtn', this.doSearch())
    // },
    // async lookUp(el) {
    //   const q = this.query
    //   const res = await this.$axios.post('/api/literature/_search', {
    //     explain: true,
    //     sort: ['_score'],
    //     query: {
    //       multi_match: {
    //         query: q,
    //         type: 'bool_prefix',
    //         fields: ['content', 'meta.*']
    //       }
    //     }
    //   })
    //   this.search = res.data
    // },
    async querySuggestions(q) {
      this.isLoading = true
      const suggestions = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'file', 'path'],
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
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              content: { number_of_fragments: 3 }
            }
          }
        })
        .then((res) => {
          // let string = JSON.stringify(res.data.hits.hits.highlight)
          // console.log(res.data.hits)
          this.items = res.data.hits.hits
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
      // console.log('fired')
      this.$router.push('/search?q=' + this.search)
      this.route = '/search?q=' + this.search
    }
  }
}
</script>
