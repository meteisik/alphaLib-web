<template>
  <v-row align="start" justify="center" no-gutters>
    <v-col cols="7" align-self="start">
      <v-row no-gutters>
        <div v-if="$fetchState.pending">
          Fetching with page query {{ $route.query }}...
        </div>
        <v-card
          v-for="(doc, i) in hits"
          :key="i + '-' + doc._id"
          class="mx-auto mb-2"
          width="100%"
          flat
          hover
          rounded
          link
          @click="renderInfoBox(doc)"
        >
          <v-card-title class="primary--text">
            {{ doc._source.meta.title }}
          </v-card-title>
          <v-card-subtitle class="pb-md-0">
            {{ doc._source.file.filename }} Score: {{ doc._score }}
          </v-card-subtitle>
          <v-card-text v-if="doc.highlight">
            <ul>
              <li
                v-for="phrase in doc.highlight.content"
                :key="phrase"
                v-html="phrase"
              ></li>
            </ul>
            {{ doc._source.path.real }}
          </v-card-text>
        </v-card>
        <v-col cols="6" align-self="center" class="mx-auto">
          <v-pagination
            v-model="page"
            :circle="paginationCircle"
            :disabled="paginationDisabled"
            :length="totalPages"
            :page="page"
            :total-visible="10"
          ></v-pagination>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="paginationSize"
            :items="[5, 10, 20, 40]"
            label="Num. of Items"
            hint="Items per page"
            persistent-hint
            dense
            flat
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="5" align-self="start">
      <TheInfoBox
        v-show="showInfoBox"
        class="mb-2"
        max-width="90%"
        :hover="false"
        :meta="infoData"
      ></TheInfoBox>

      <HeatMapWrapper
        :id="charts.heatmap.id"
        class="mb-2"
        :div-id="charts.heatmap.divId"
        :svg-id="charts.heatmap.svgId"
        :hover="false"
        :label="charts.heatmap.label"
        :dataset="hits"
        :chart-width="charts.heatmap.width"
        :chart-height="charts.heatmap.height"
        max-width="90%"
      ></HeatMapWrapper>
      <GraphWrapper
        :id="charts.conceptmap.id"
        class="mb-2"
        :div-id="charts.conceptmap.divId"
        :svg-id="charts.conceptmap.svgId"
        :hover="false"
        :label="charts.conceptmap.label"
        :dataset="hits"
        :chart-width="charts.conceptmap.width"
        :chart-height="charts.conceptmap.height"
        max-width="90%"
      ></GraphWrapper>
    </v-col>
  </v-row>
</template>

<script>
import TheInfoBox from '~/components/InfoBox/TheInfoBox'
import HeatMapWrapper from '~/components/HeatMap/HeatMapWrapper'
import GraphWrapper from '~/components/ConceptMap/GraphWrapper'
export default {
  name: 'PageDocsIndex',
  components: { GraphWrapper, HeatMapWrapper, TheInfoBox },
  watchQuery: true,
  async fetch() {
    // Get query params
    const q = this.q
    const pageSize = this.paginationSize
    const page = this.page
    const offset = pageSize * (page - 1)

    // Building the query
    // By default (when q is empty), we want to list all documents
    let match = {
      match_all: {}
    }
    if (q)
      match = {
        multi_match: {
          query: q,
          type: 'bool_prefix',
          fields: ['meta', 'content']
        }
      }

    // Getting the results based on the query
    const res = await this.$axios
      .post('/api/literature/_search', {
        explain: true,
        sort: ['_score'],
        _source: ['meta', 'file', 'path'],
        query: match,
        from: offset,
        size: pageSize,
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
        return res
      })
      .catch((e) => {
        console.log(e)
        return null
      })
    // The returned object will be merged with `this.data`
    this.search = res.data
  },
  data: () => ({
    showInfoBox: false,
    infoData: {},
    // Search configuration
    paginationCircle: false,
    paginationDisabled: false,

    // Search Results
    search: null,
    // Charts and all of their configurations
    charts: {
      heatmap: {
        id: 'heatmap',
        divId: 'heatmap-div',
        svgId: 'heatmap-chart-svg-element',
        label: 'Tiles',
        width: 500,
        height: 100
      },
      conceptmap: {
        id: 'conceptmap',
        divId: 'conceptmap-div',
        svgId: 'conceptmap-chart-svg-element',
        label: 'Concept Map',
        width: 500,
        height: 700
      }
    }
  }),
  computed: {
    q() {
      return this.$route.query.q || null
    },
    page: {
      get() {
        if (this.$route.query.page) return +this.$route.query.page
        return 1
      },
      set(v) {
        // TODO: handle this in a better way
        let path = '/docs?page=' + v + '&size=' + this.paginationSize
        if (this.q) path += '&q=' + this.q
        this.$router.push(path)
      }
    },
    paginationSize: {
      get() {
        if (this.$route.query.size) return +this.$route.query.size
        return 10
      },
      set(v) {
        // TODO: handle this in a better way
        let path = '/docs?page=1' + '&size=' + v
        if (this.q) path += '&q=' + this.q
        this.$router.push(path)
      }
    },
    hits() {
      if (this.search === null) return []
      return this.search.hits.hits
    },
    totalPages() {
      if (this.search === null) return 0
      return Math.ceil(this.search.hits.total.value / this.paginationSize)
    },
    heatmapHeight() {
      return 40 + this.hits.length * 8
    }
  },
  watch: {
    '$route.query.page': '$fetch',
    '$route.query.size': '$fetch'
  },
  layout: 'withsearchbar',
  mounted() {
    if (this.q) this.$store.commit('ADD_QUERY', this.q)
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    makeDate(dateString) {
      if (!dateString) return
      return new Date(dateString).toDateString()
    },
    async getDocAbstract(docId) {
      const res = await this.$axios.get('/api/literature/_doc/' + docId)
      return res.data.found
        ? `${res.data._source.content.substring(0, 500)}...`
        : ''
    },
    async renderInfoBox(doc) {
      if (!this.showInfoBox) this.showInfoBox = true
      this.infoData = { ...this.infoData, isLoading: true }
      const {
        title = '',
        author = '',
        created = null,
        abstract = '',
        image = '',
        raw
      } = doc._source.meta
      this.infoData = {
        doc_id: doc._id,
        image,
        title,
        author,
        created_date: this.makeDate(created),
        abstract:
          abstract.length < 1 ? await this.getDocAbstract(doc._id) : abstract,
        number_of_pages: parseInt(raw['xmpTPg:NPages'], 10),
        isLoading: false
      }
    },
    resize() {
      const heatDiv = document.getElementById(this.charts.heatmap.divId)
      if (heatDiv) {
        this.charts.heatmap.width = heatDiv.clientWidth - 30
        this.charts.heatmap.height = this.heatmapHeight
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('width', this.charts.heatmap.width)
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('height', this.charts.heatmap.height)
      }

      const conceptDiv = document.getElementById(this.charts.conceptmap.divId)
      if (conceptDiv) {
        this.charts.conceptmap.width = conceptDiv.clientWidth - 30
        document
          .getElementById(this.charts.conceptmap.svgId)
          .setAttribute('width', this.charts.conceptmap.width)
        document
          .getElementById(this.charts.conceptmap.svgId)
          .setAttribute('height', this.charts.conceptmap.height)
      }
    }
  }
}
</script>

<style scoped></style>

