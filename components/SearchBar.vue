<template>
  <v-autocomplete
    v-model="selectedSuggestion"
    :search-input.sync="query"
    :items="hits"
    :loading="isLoading"
    :outlined="!solo"
    :solo="solo"
    :hide-details="hideDetails"
    :dense="dense"
    :autofocus="autofocus"
    clearable
    rounded
    single-line
    full-width
    prepend-inner-icon="mdi-magnify"
    color="primary"
    hide-no-data
    hide-selected
    :placeholder="placeholder"
    item-text="_source.file.filename"
    item-value="_source.file.filename"
    return-object
    @keyup.native.enter="enterPressed"
  >
    <tempate v-slot:no-data>
      <v-list-item-title>
        {{ 'Not Specified' }}
      </v-list-item-title>
    </tempate>
    <template v-slot:item="{ item }">
      <v-icon color="grey">fas fa-list</v-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ item._source.meta.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ 'By: ' + item._source.meta.url }}
        </v-list-item-subtitle>
        <v-list-item-subtitle :key="item._id">
          <ul>
            <li
              v-for="phrase in item.highlight.content"
              :key="phrase"
              v-html="phrase"
            ></li>
          </ul>
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: 'SearchBar ...'
    },
    solo: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    initialQuery: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      suggestions: null,
      query: '',
      route: '',
      selectedSuggestion: null
    }
  },
  computed: {
    hits() {
      if (!this.suggestions) return []
      if (this.suggestions.hits)
        if (this.suggestions.hits.hits) return this.suggestions.hits.hits
      return []
    }
  },
  watch: {
    query(val) {
      this.$emit('typed', val)
      this.$fetch()
    },
    selectedSuggestion(val) {
      this.$emit('selected', val)
    }
  },
  async fetch() {
    this.isLoading = true
    const q = this.query
    const suggestions = await this.$axios
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
            content: { number_of_fragments: 3 }
          }
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((e) => {
        console.log(e)
        return {}
      })
    this.isLoading = false
    this.suggestions = suggestions
  },
  methods: {
    enterPressed() {
      this.$emit('enter', this.query)
    }
  }
}
</script>
