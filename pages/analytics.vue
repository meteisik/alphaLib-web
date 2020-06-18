<template>
  <div>
    <div>
      <p>
        <!-- This line works fine, I can retrieve information nicely -->
        {{ term_vectors[0].term_vectors.content.field_statistics.sum_doc_freq }}
      </p>
    </div>
    <!-- whenever I use term_vectors or docs here, errors happen -->
    <v-data-table :items="words" :headers="headers">
      <template #item.name="{item}"> {{ item.name }} is the name </template>
      <template #item.wordCount="{item}">
        {{ item.wordCount }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  computed: {
    headers() {
      return [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Word Count',
          value: 'wordCount'
        }
      ]
    },
    words() {
      return [
        {
          name: 'testName',
          wordCount: '25'
        },
        {
          name: 'testName2',
          wordCount: '25000'
        }
      ]
    }
  },
  async asyncData({ query, $axios }) {
    let match = { match_all: {} }
    if (query.q)
      match = {
        match_phrase: { content: query.q }
      }
    const docs = await $axios
      .post('/api/literature/_search', {
        sort: ['_score'],
        _source: ['meta'],
        query: match,
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
        return res.data.hits.hits
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
        return []
      })
    const termVectors = await $axios
      .post('/api/literature/_mtermvectors', {
        ids: docs.map((d) => d._id),
        parameters: {
          fields: ['content'],
          term_statistics: true
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
        return {}
      })
    // console.log(termVectors.docs[4].term_vectors.content.field_statistics)
    return { docs, term_vectors: termVectors.docs }
  }
}
</script>

<style scoped></style>
