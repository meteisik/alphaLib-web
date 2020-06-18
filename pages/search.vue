<template>
  <v-row align="start" justify="start" no-gutters>
    <v-col v-for="(doc, i) in hits" :key="i + '-' + doc._id" cols="12" md="4">
      <v-card color="primary" hover>
        <v-list two-line>
          <v-list-item-group v-model="selected" active-class="pink--text">
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title">
                      {{ doc._source.meta.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text--primary">
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.action">
                    </v-list-item-action-text>
                    <v-icon v-if="!active" color="grey lighten-1">
                      star_border
                    </v-icon>
                    <v-icon v-else color="yellow">
                      star
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider
                v-if="index + 1 < items.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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
            content: { number_of_fragments: 10 }
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
