<template>
  <v-app v-cloak dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!--      <v-btn icon @click.stop="miniVariant = !miniVariant">-->
      <!--        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>-->
      <!--      </v-btn>-->
      <!--      <v-btn icon @click.stop="clipped = !clipped">-->
      <!--        <v-icon>mdi-application</v-icon>-->
      <!--      </v-btn>-->
      <v-btn icon nuxt to="/">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <!--      <v-btn icon @click.stop="fixed = !fixed">-->
      <!--        <v-icon>mdi-minus</v-icon>-->
      <!--      </v-btn>-->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!-- <v-text-field
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
      ></v-text-field> -->
      <Autocomplete class="mx-auto mt-10" />
      <!-- <v-btn blo @click="newSearch">Search</v-btn> -->
      <v-spacer />
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>mdi-{{ `brightness-${dark ? '5' : '4'}` }}</v-icon>
      </v-btn>
      <!--      <v-btn icon @click.stop="rightDrawer = !rightDrawer">-->
      <!--        <v-icon>mdi-menu</v-icon>-->
      <!--      </v-btn>-->
    </v-app-bar>

    <v-content v-cloak>
      <v-container fluid>
        <nuxt v-cloak keep-alive :keep-alive-props="{ max: 10 }" />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app padless>
      <v-col class="text-center overline" cols="12">
        &copy; {{ new Date().getFullYear() }} —
        <a
          href="http://insight.uwo.ca/"
          target="_blank"
          style="text-decoration: none;"
        >
          InsightLab
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Autocomplete from '~/components/Autocomplete.vue'

export default {
  name: 'SearchLayout',
  components: {
    Autocomplete
  },
  data() {
    return {
      button: false,
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Analytics',
          to: '/analytics'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
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
  }
}
// watch: {
//   route() {
//     this.$router.push('/search?q=' + this.search)
//   }
// },
//   methods: {
//     doSearch() {
//       this.$router.push('/search?q=' + this.search)
//     }
//   }
// }
</script>
