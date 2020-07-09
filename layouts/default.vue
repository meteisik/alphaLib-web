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
export default {
  name: 'DefaultLayout',
  components: { TheNavigationDrawer, TheFooter },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      title: 'AlphaLib'
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
    }
  }
}
</script>
