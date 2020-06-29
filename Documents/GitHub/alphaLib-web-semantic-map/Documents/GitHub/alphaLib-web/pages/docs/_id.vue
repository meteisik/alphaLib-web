<template>
  <div>
    <!--    <document :doc="document"></document>-->
    <p>{{ document._source.content }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageDocumentsID',
  async asyncData({ params, $axios }) {
    // Query details: https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html
    const res = await $axios.get('/api/literature/_doc/' + params.id)
    return { document: res.data }
  }
}
</script>

<style scoped></style>
