<template>
  <div>
    Hi
  </div>
</template>

<script>
export default {
  name: 'Analytics',
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
    return { docs, term_vectors: termVectors.docs }
  }
}
</script>

<style scoped></style>
