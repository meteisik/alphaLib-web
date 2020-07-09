<template>
  <v-app dark>
    <TheNavigationDrawer :drawer="drawer" :clipped="clipped" />
    <v-app-bar :clipped-left="clipped" fixed app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon nuxt to="/">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <SearchBar
        :hide-details="true"
        :dense="true"
        :initial-query="routeQuery"
        :autofocus="false"
        @selected="suggestionSelected"
        @enter="doSearch"
        @typed="typed"
      />
      <v-spacer />
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>mdi-{{ `brightness-${dark ? '7' : '4'}` }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt keep-alive :keep-alive-props="{ max: 10 }" />
      </v-container>
    </v-content>
    <TheFooter :fixed="fixed"></TheFooter>
  </v-app>
</template>

<script>
import TheFooter from '~/components/TheFooter'
import TheNavigationDrawer from '~/components/TheNavigationDrawer'
import SearchBar from '~/components/SearchBar'
export default {
  name: 'WithSearchBarLayout',
  components: { SearchBar, TheNavigationDrawer, TheFooter },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      title: 'AlphaLib',
      isLoading: false,
      query: '',
      solo: true
    }
  },
  computed: {
    dark: {
      get() {
        return this.$vuetify.theme.dark
      },
      set(val) {
        this.$vuetify.theme.dark = val
      }
    },
    routeQuery() {
      return this.$route.query.q
    }
  },
  methods: {
    doSearch(query) {
      this.typed(query)
      this.$store.commit('ADD_QUERY', { q: this.query })
      this.$router.push('/docs?q=' + this.query)
    },
    typed(phrase) {
      this.query = phrase
    },
    suggestionSelected(suggestion) {
      this.suggestionSelected = suggestion
      this.$store.commit('ADD_QUERY', {
        q: suggestion._source.file.filename,
        to: '/docs/' + suggestion._id
      })
      this.$router.push('/docs/' + suggestion._id)
    }
  }
}
</script>
