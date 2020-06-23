<template>
  <div>
    <h1>document ID: {{ $route.params.id }}</h1>
    <p>index: {{ findIdIndex(term_vectors) }}</p>
    <div class="documentText">
      {{ docs[docIndex]._source.content }}
    </div>
    <div class="documentFreq">
      <v-data-table
        :headers="headers"
        :items="tableData(term_vectors[docIndex])"
        multi-sort
      ></v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  data() {
    return {
      docIds: [],
      idInput: 'ID here',
      docIndex: 0, // impossible index
      headers: [
        {
          text: 'Term',
          value: 'term'
        },
        {
          text: 'Frequency',
          value: 'freq'
        }
      ]
    }
  },
  computed: {
    findIdIndex() {
      return (terms) => {
        if (this.docIds.length === 0) {
          for (let i = 0; i < terms.length; i++) {
            this.docIds.push(terms[i]._id)
          }
        }
        for (let i = 0; i < this.docIds.length; i++) {
          if (this.docIds[i] === this.$route.params.id) {
            this.docIndex = i
          }
        }
        return this.docIndex
      }
    },
    tableData() {
      return (document) => {
        // Getting the terms object
        const terms = document.term_vectors.content.terms
        // Turning the object into an array
        const termsList = Object.keys(terms)

        // Building the result array
        const result = []
        for (const t of termsList) {
          result.push({
            term: t,
            freq: terms[t].term_freq
          })
        }
        // Sort by frequency and return the result
        return result.sort((a, b) => {
          return a.freq < b.freq
        })
      }
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
        _source: ['meta', 'content'],
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

<style scoped>
.documentText {
  border-right: 5px solid #07031a;
  float: left;
  width: 50%;
  box-sizing: border-box;
}
.documentFreq {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
</style>
