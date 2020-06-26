<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="mt-10">
      <div class="text-center">
        <logo />
        <VeutifyLogo />
      </div>
    </v-col>
    <v-col cols="6" align-self="center" class="text-center">
      <Autocomplete />
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VeutifyLogo from '~/components/VuetifyLogo.vue'
import Autocomplete from '~/components/Autocomplete.vue'

export default {
  components: {
    Logo,
    VeutifyLogo,
    Autocomplete
  },
  data() {
    return {
      isLoading: false,
      solo: false,
      suggestions: null,
      route: '',
      searchInput: ''
    }
  }
  // watch: {
  //   route() {}
  // }
  // methods: {
  // handleClick(event) {
  // this.$router.push('/search?q=' + event)
  // }
  // }
}
</script>
