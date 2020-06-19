<template>
  <v-row align="start" justify="start" no-gutters>
    <!-- Used md="9" for 9-column width of the v-col -->
    <v-col v-for="(doc, i) in hits" :key="i + '-' + doc._id" cols="12" md="9">
      <v-card max-width="1000" class="mx-auto">
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ doc._source.file.filename }}
              </v-list-item-subtitle>
              <v-list-item-title style="color: blue;">
                {{ doc._source.meta.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ doc._source.meta.author }}
              </v-list-item-subtitle>

              <v-list-item-subtitle>{{
                doc._source.file.url
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-content>
              <ul>
                <li
                  v-for="phrase in doc.highlight.content"
                  :key="phrase"
                  v-html="phrase"
                ></li>
              </ul>
              <div>
                <v-btn small color="primary">Visit</v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
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
        // eslint-disable-next-line no-console
        console.log(e)
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
