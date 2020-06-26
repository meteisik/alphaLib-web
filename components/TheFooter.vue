<template>
  <v-footer :fixed="fixed" app padless>
    <v-col class="text-center overline py-1" cols="12">
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
</template>

<script>
export default {
  name: 'TheFooter',
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
