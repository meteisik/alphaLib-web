<template>
  <v-row justify="start" no-gutters>
    <v-col cols="1">
      Queries...
      <ul>
        <li v-for="(qur, i) in queries" :key="i">
          {{ qur.query }}
        </li>
      </ul>
      <v-btn @click.stop="$fetch">Refresh</v-btn>
    </v-col>
    <v-col cols="3">
      <HeatMapWrapperForAnalytics
        :id="charts.heatmap.id"
        class="mb-2"
        :div-id="charts.heatmap.divId"
        :svg-id="charts.heatmap.svgId"
        :hover="false"
        :label="charts.heatmap.label"
        :dataset="responses"
        :chart-width="charts.heatmap.width"
        :chart-height="charts.heatmap.height"
        max-width="100%"
      ></HeatMapWrapperForAnalytics>
    </v-col>
    <v-col cols="3">
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
        max-width="100%"
      ></GraphWrapper>
    </v-col>
    <v-col cols="3">
      <HeatMapWrapperForAnalytics
        :id="charts.heatmap.id"
        class="mb-2"
        :div-id="charts.heatmap.divId"
        :svg-id="charts.heatmap.svgId"
        :hover="false"
        :label="charts.heatmap.label"
        :dataset="responses"
        :chart-width="charts.heatmap.width"
        :chart-height="charts.heatmap.height"
        max-width="100%"
      ></HeatMapWrapperForAnalytics>
    </v-col>
    <v-row>
      <v-col cols="3">
        <v-row v-for="doc in documents" :key="doc._id">
          <DocPortionWrapper
            :id="charts.heatmap2.id + doc._id"
            class="mb-2"
            :div-id="charts.heatmap2.divId + doc._id"
            :svg-id="charts.heatmap2.svgId + doc._id"
            :hover="false"
            :label="doc._source.path.virtual"
            :dataset="filteredDocuments(doc._id)"
            :chart-width="charts.heatmap2.width"
            :chart-height="charts.heatmap2.height"
            max-width="50%"
          ></DocPortionWrapper>
        </v-row>
      </v-col>
      <v-col cols="3">
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
          max-width="100%"
        ></GraphWrapper>
      </v-col>
      <v-col cols="3">
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
          max-width="100%"
        ></GraphWrapper>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import HeatMapWrapperForAnalytics from '~/components/HeatMap/HeatMapWrapperForAnalytics'
import DocPortionWrapper from '~/components/HeatMap/DocPortionWrapper'
import GraphWrapper from '~/components/ConceptMap/GraphWrapper'
import { eventBus } from '@/plugins/bus.js'

export default {
  name: 'PageAnalyticsTiles',
  plugins: {
    eventBus
  },
  components: { DocPortionWrapper, HeatMapWrapperForAnalytics, GraphWrapper },
  layout: 'withsearchbar',
  watchQuery: true,
  async fetch() {
    // Get query params
    // const q = this.queries
    /*
    const pageSize = this.paginationSize
    const page = this.page
    const offset = pageSize * (page - 1 )
     */

    // Building the query
    // By default (when q is empty), we want to list all documents
    // let match = {
    //   match_all: {}
    // }
    // if (q)
    //    match = {
    //     multi_match: {
    //       query: q,
    //       type: 'bool_prefix',
    //       fields: ['meta', 'content']
    //     }
    //   }
    // Getting results based on query
    const res = []
    const fullText = []
    for (const qu of this.queries) {
      const tmp = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'file', 'path'],
          size: 100,
          query: {
            multi_match: {
              query: qu.query,
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
              content: { number_of_fragments: 2000 }
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
      res.push({
        query: qu.query,
        response: tmp
      })

      const tmp2 = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'file', 'path'],
          size: 100,
          query: {
            multi_match: {
              query: qu.query,
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
              content: { number_of_fragments: 0 }
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
      fullText.push({
        query: qu.query,
        response: tmp2
      })
    }
    this.responses = res
    this.fullTextResponses = fullText
  },
  data() {
    return {
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
          label: 'Concept Intensity Across Documents',
          width: 200,
          height: 400
        },
        heatmap2: {
          id: 'heatmap2',
          divId: 'heatmap2-div',
          svgId: 'heatmap2-chart-svg-element',
          label: 'Positional Concept Intensity Across Documents',
          width: 150,
          height: 150
        },
        conceptmap: {
          id: 'conceptmap',
          divId: 'conceptmap-div',
          svgId: 'conceptmap-chart-svg-element',
          label: 'Concept Map',
          width: 200,
          height: 500
        }
      },
      responses: [],
      fullTextResponses: []
    }
  },
  computed: {
    documents() {
      const res = []
      for (const group of this.fullTextResponses)
        for (const doc of group.response.hits.hits) {
          if (!res.map((d) => d._id).includes(doc._id)) res.push(doc)
        }
      return res
    },
    filteredDocuments() {
      return (id) => {
        const res = []
        for (const group of this.fullTextResponses) {
          for (const doc of group.response.hits.hits)
            if (doc._id === id)
              res.push({
                query: group.query,
                response: doc
              })
        }
        return res
      }
    },
    queries() {
      return this.$store.state.searchQueries
    },
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
      return 500
    }
  },
  watch: {
    '$route.query.page': '$fetch',
    '$route.query.size': '$fetch',
    '$route.query.q': '$fetch'
  },
  created() {
    eventBus.$on('selected', (val) => {
      this.search = val
      console.log('tiles got changed query ' + val)
    })
  },
  mounted() {
    if (this.q) this.$store.commit('ADD_QUERY', { q: this.q })
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      const heatDiv = document.getElementById(this.charts.heatmap.divId)
      if (heatDiv) {
        // this.charts.heatmap.width = heatDiv.clientWidth - 30
        this.charts.heatmap.width = 300 + this.responses.length * 30
        this.charts.heatmap.height = this.heatmapHeight
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('width', this.charts.heatmap.width)
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('height', this.charts.heatmap.height)
      }

      for (const doc of this.documents) {
        const heatDiv2 = document.getElementById(
          this.charts.heatmap2.divId + doc._id
        )
        if (heatDiv2) {
          // console.log('found')
          // this.charts.heatmap.width = heatDiv.clientWidth - 30
          this.charts.heatmap2.width =
            400 + this.filteredDocuments(doc._id).length * 20
          this.charts.heatmap2.height = this.heatmapHeight
          document
            .getElementById(this.charts.heatmap2.svgId + doc._id)
            .setAttribute('width', this.charts.heatmap2.width)
          document
            .getElementById(this.charts.heatmap2.svgId + doc._id)
            .setAttribute('height', this.charts.heatmap2.height)
        }
      }
      const conceptDiv = document.getElementById(this.charts.conceptmap.divId)
      if (conceptDiv) {
        this.charts.conceptmap.width = conceptDiv.clientWidth - 10
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
