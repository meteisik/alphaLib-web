<template>
  <v-row align="start" justify="start" no-gutters>
    <v-col v-for="(doc, i) in hits" :key="i + '-' + doc._id" cols="7">
      <v-card
        class="mx-md-10 my-md-1"
        flat
        hover
        outlined
        rounded
        link
        :to="'docs/' + doc.id"
      >
        <v-card-title class="primary--text">
          {{ doc._source.meta.title }}
        </v-card-title>
        <!-- Used pb-md-0 for removing margins from bottom in md screen -->
        <v-card-subtitle class="pb-md-0">
          {{ doc._source.file.filename }}
        </v-card-subtitle>
        <v-card-text>
          <ul>
            <li
              v-for="phrase in doc.highlight.content"
              :key="phrase"
              v-html="phrase"
            ></li>
          </ul>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Search',
  async asyncData({ query, $axios }) {
    const q = query.q
    const res = await $axios
      .post('/api/literature/_search', {
        explain: true,
        sort: ['_score'],
        _source: ['meta', 'file', 'path'],
        query: {
          multi_match: {
            query: q,
            type: 'bool_prefix',
            fields: ['meta', 'content']
          }
        },
        highlight: {
          type: 'unified',
          order: 'score',
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
          fields: {
            content: { number_of_fragments: 5 }
          }
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((e) => {
        return null
      })
    return { search: res }
  },
  layout: 'search',
  data: () => ({
    show: false
  }),
  computed: {
    q() {
      return this.$route.query.q
    },
    hits() {
      if (this.search === null) return []
      return this.search.hits.hits
    }
  }
}
</script>

<style scoped></style>
