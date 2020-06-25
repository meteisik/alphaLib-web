<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="mt-10">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
    </v-col>
    <v-col cols="6" align-self="center" class="text-center">
      <Autocomplete />
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import Autocomplete from '~/components/Autocomplete.vue'

export default {
  components: {
    Logo,
    VuetifyLogo,
    Autocomplete
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    search: {
      type: String
    },
    query: {
      type: String
    }
  },
  data() {
    return {
      isLoading: false,
      solo: false,
      suggestions: null,
      route: '',
      button: false
    }
  },
  watch: {
    route() {
      this.searchUp(this.$route.params.search)
    }
  },
  methods: {
    handleClick(event) {
      this.$router.push('/search?q=' + this.search)
    }
  }
}
</script>
