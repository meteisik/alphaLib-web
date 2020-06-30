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
      <v-text-field
        v-model="search"
        :loading="isLoading"
        :outlined="!solo"
        :solo="solo"
        rounded
        single-line
        dense
        hide-details
        cache-items
        prepend-inner-icon="mdi-magnify"
        placeholder="The meaning of life..."
      ></v-text-field>
      <v-spacer />
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>mdi-{{ `brightness-${dark ? '5' : '4'}` }}</v-icon>
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
export default {
  name: 'WithSearchBarLayout',
  components: { TheNavigationDrawer, TheFooter },
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
  methods: {
    doSearch() {
      this.$router.push('/search?q=' + this.search)
    }
  }
}
</script>
