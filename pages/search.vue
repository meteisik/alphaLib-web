<template>
  <v-row align="start" justify="start" no-gutters>
    <v-col v-for="(doc, i) in hits" :key="i + '-' + doc._id" cols="12" md="4">
      <v-card color="primary" dark>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title>{{ doc._source.meta.title }}</v-card-title>
            <v-card-subtitle>{{ doc._source.file.filename }}</v-card-subtitle>
            <v-card-subtitle>{{ doc._source.file.url }}</v-card-subtitle>
            <v-card-subtitle>
              <ul>
                <li
                  v-for="phrase in doc.highlight.content"
                  :key="phrase"
                  v-html="phrase"
                ></li>
              </ul>
            </v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Search',
  layout: 'search',
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
        // eslint-disable-next-line no-console
        console.log(e)
        return null
      })
    return { search: res }
  },
  mounted() {
    console.log(this.$router)
  },
  data() {
    return {
      search: null
    }
  },
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
