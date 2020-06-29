<template>
  <v-app dark>
    <v-row align="center" justify="center">
      <TheNavigationDrawer :drawer="drawer" :clipped="clipped" />
      <v-app-bar :clipped-left="clipped" fixed app flat>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn icon nuxt to="/">
          <v-icon>mdi-application</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-col cols="5" class="text-center">
          <Autocomplete class="d-flex p-6 mt-10 mb-n0" />
        </v-col>
        <v-spacer />
        <v-btn icon @click.stop="dark = !dark">
          <v-icon>mdi-{{ `brightness-${dark ? '5' : '4'}` }}</v-icon>
        </v-btn>
      </v-app-bar>
      <v-content>
        <v-container fluid>
          <nuxt-child
            :key="$route.fullPath"
            keep-alive
            :keep-alive-props="{ max: 10 }"
          ></nuxt-child>
        </v-container>
      </v-content>
      <TheFooter :fixed="fixed"></TheFooter>
    </v-row>
  </v-app>
</template>

<script>
import TheFooter from '~/components/TheFooter'
import TheNavigationDrawer from '~/components/TheNavigationDrawer'
import Autocomplete from '~/components/Autocomplete'
export default {
  key($route) {
    return $route.fullPath
  },
  watchQuery: ['search', 'query'],
  name: 'WithSearchBarLayout',
  components: { TheNavigationDrawer, TheFooter, Autocomplete },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      title: 'AlphaLib',
      isLoading: false,
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
    search() {
      return this.$route.query.q
    },
    hits() {
      return []
      // if (this.search === null) return []
      // return this.search.hits.hits
    }
  },
  watch: {
    route() {
      // this works because it reloads after the function fails, not sure how to make it legal
      this.searchUp(this.$route.params.search)
      this.$router.push('/docs?q=' + this.search)
    }
  },
  methods: {
    doSearch() {
      this.$router.push('/search?q=' + this.search)
    }
  }
}
</script>
