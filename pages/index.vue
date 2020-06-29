<template>
  <v-row align="center" justify="center">
    <v-col cols="5" class="mt-10 text-center" align-self="center">
      <logo />
      <vuetify-logo />
    </v-col>
    <v-col
      cols="10"
      align-self="center"
      class="
   text-center"
    >
      <v-row align="center" justify="center">
        <v-col cols="5" align-self="center">
          <!--          <router-view :key="$route.fullPath"></router-view>-->
          <Autocomplete class="d-flex"></Autocomplete>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="history.length > 0" cols="12" align-self="center">
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-list tile dense rounded>
            <v-subheader>Recent queries</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                v-for="(item, i) in history"
                :key="i"
                link
                :to="'/docs?q=' + item.query"
              >
                <v-list-item-icon>
                  <v-icon>mdi-history</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.query }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import Autocomplete from '~/components/Autocomplete'

export default {
  name: 'PageIndex',
  components: {
    Logo,
    VuetifyLogo,
    Autocomplete
  },
  data() {
    return {
      isLoading: false,
      solo: false,
      query: '',
      search: '',
      suggestions: null,
      watchQuery: true
    }
  },
  computed: {
    // hits() {
    //   if (this.suggestions === null) return []
    //   if (Object.keys(this.suggestions).includes('hits'))
    //     if (Object.keys(this.suggestions.hits).includes('hits'))
    //       return this.suggestions.hits.hits
    //   return []
    // },
    history() {
      return this.$store.state.searchQueries
    }
  },
  // watch: {
  //   search(val) {
  //     this.querySuggestions(val)
  //   }
  // },
  // watch: {
  //   route() {
  //     // this works because it reloads after the function fails, not sure how to make it legal
  //     this.searchUp(this.$route.params.search)
  //     this.$router.push('/docs?q=' + this.search)
  //   }
  // },
  methods: {
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
    // async querySuggestions(q) {
    //   this.isLoading = true
    //   const suggestions = await this.$axios
    //     .post('/api/literature/_search', {
    //       explain: true,
    //       _source: ['path'],
    //       query: {
    //         multi_match: {
    //           query: q,
    //           type: 'bool_prefix',
    //           fields: ['meta', 'content']
    //         }
    //       },
    //       highlight: {
    //         type: 'unified',
    //         order: 'score',
    //         fields: {
    //           content: { number_of_fragments: 200 }
    //         }
    //       }
    //     })
    //     .then((res) => {
    //       return res.data
    //     })
    //     .catch((e) => {
    //       return {}
    //     })
    //   this.isLoading = false
    //   this.suggestions = suggestions
    // },
    doSearch() {
      this.$store.commit('ADD_QUERY', this.search)
      this.$router.push('/docs?q=' + this.search)
    },
    removeQueryFromHistory(searchItem) {
      this.$store.commit('REMOVE_QUERY', searchItem.query)
    }
  }
}
</script>
