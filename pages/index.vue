<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="mt-10 text-center" align-self="center">
      <logo />
      <vuetify-logo />
    </v-col>
    <v-col cols="12" align-self="center" class="text-center">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" align-self="center">
          <SearchBar
            @selected="suggestionSelected"
            @enter="doSearch"
            @typed="typed"
          />
          <v-btn link @click.stop="doSearch">Search</v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="history.length > 0" cols="12" align-self="center">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-list tile dense rounded>
            <v-subheader>Recent queries</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                v-for="(item, i) in history"
                :key="i"
                link
                :to="item.to"
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
import SearchBar from '~/components/SearchBar'

export default {
  name: 'PageIndex',
  components: {
    SearchBar,
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      isLoading: false,
      solo: false,
      query: '',
      selectedSuggestion: null
    }
  },
  computed: {
    history() {
      return this.$store.state.searchQueries
    }
  },
  watch: {
    query(val) {
      // this.querySuggestions(val)
    }
  },
  methods: {
    doSearch(query) {
      console.log('doing search on: ', this.query)
      this.typed(query)
      this.$store.commit('ADD_QUERY', { q: this.query })
      this.$router.push('/docs?q=' + this.query)
    },
    typed(phrase) {
      console.log('typed: ', phrase)
      this.query = phrase
    },
    suggestionSelected(suggestion) {
      this.suggestionSelected = suggestion
      this.$store.commit('ADD_QUERY', {
        q: suggestion._source.file.filename,
        to: '/docs/' + suggestion._id
      })
      this.$router.push('/docs/' + suggestion._id)
    },
    removeQueryFromHistory(searchItem) {
      this.$store.commit('REMOVE_QUERY', searchItem.query)
    }
  }
}
</script>
