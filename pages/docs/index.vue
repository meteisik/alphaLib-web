<template>
  <v-row align="start" justify="start" no-gutters>
    <v-col v-for="(doc, i) in hits" :key="i + '-' + doc._id" cols="12" md="9">
      <v-card class="mx-md-10 my-md-1">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-subtitle class="pb-md-0">
              {{ doc._source.file.filename }}
            </v-card-subtitle>
            <v-card-title style="color: blue;" class="pt-md-0">
              {{ doc._source.meta.title }}
            </v-card-title>
            <!-- Used pb-md-0 for removing margins from bottom in md screen -->
            <v-card-subtitle class="pb-md-0">
              {{ doc._source.file.url }}
            </v-card-subtitle>
            <v-card-subtitle v-if="doc.highlight">
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
  name: 'PageDocumentsIndex',
  async asyncData({ query, $axios }) {
    const q = query.q
    const postData =
      !q || q === 'null'
        ? { size: 10000 }
        : {
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
          }

    const res = await $axios
      .post('/api/literature/_search', postData)
      .then((res) => {
        return res.data
      })
      .catch((e) => {
        return null
      })
    return { documents: res }
  },
  data() {
    return {
      documents: null
    }
  },
  computed: {
    q() {
      return this.$route.query.q
    },
    hits() {
      if (this.documents === null) return []
      return this.documents.hits.hits
    }
  }
}
</script>

<style scoped></style>
