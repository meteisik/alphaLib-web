<template>
  <v-row align="start" justify="center" no-gutters>
    <v-col cols="7" align-self="start">
      <v-row no-gutters>
        <div v-if="$fetchState.pending">
          Fetching with page query {{ $route.query }}...
        </div>
        <div>Results for "{{ $route.query.q }}"</div>
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
        <v-card
          v-for="(doc, i) in hits"
          :key="i + '-' + doc._id"
          class="mx-auto mb-2"
          width="100%"
          flat
          hover
          rounded
          link
          :to="'docs/' + doc._id"
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
      <TheInfoBox class="mb-2" max-width="90%" :hover="false"></TheInfoBox>
      <HeatMapWrapper
        :id="charts.heatmap.id"
        class="mb-2"
        :div-id="charts.heatmap.divId"
        :svg-id="charts.heatmap.svgId"
        :hover="false"
        :label="charts.heatmap.label"
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
      <BarChartWrapper
        :svg-id="charts.barchart.svgId"
        :data-set="getbarChartData"
        :chart-width="charts.barchart.svgWidth"
        :chart-height="charts.barchart.svgHeight"
        x-key="label"
        y-key="value"
        :reduced-data="charts.barchart.reducedData"
        :label="charts.barchart.label"
        class="mb-2"
        max-width="90%"
      ></BarChartWrapper>
    </v-col>
  </v-row>
</template>

<script>
import TheInfoBox from '~/components/InfoBox/TheInfoBox'
import HeatMapWrapper from '~/components/HeatMap/HeatMapWrapper'
import GraphWrapper from '~/components/ConceptMap/GraphWrapper'
import BarChartWrapper from '~/components/BarCharts/BarChartWrapper'
export default {
  name: 'PageDocsIndex',
  components: { GraphWrapper, HeatMapWrapper, TheInfoBox, BarChartWrapper },
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
      },
      barchart: {
        svgId: 'barchart-svg-element',
        svgWidth: 500,
        svgHeight: 200,
        reducedData: false,
        label: 'Highlight Occurences'
      }
    },
    querryFreq: 0
  }),
  computed: {
    getbarChartData() {
      const allLabels = []
      const allHits = this.hits
      let documentHits = {}
      let result = []
      if (this.$route.query.q !== undefined) {
        for (let i = 0; i < allHits.length; i++) {
          if (allHits[i].highlight !== undefined) {
            documentHits = allHits[i].highlight.content
          } else {
            documentHits = {}
          }
          if (documentHits !== {}) {
            for (let j = 0; j < documentHits.length; j++) {
              // get the marked words in the array of objects form
              result = this.createBarChartArray(
                documentHits[j],
                result,
                allLabels
              )
            }
          }
        }
      }
      const objQ = result.find((obj) => {
        return obj.label === this.q
      })
      this.getFreq(objQ)
      // this.addStore(objQ)
      return result
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
      return 40 + this.hits.length * 8
    }
  },
  watch: {
    '$route.query.page': '$fetch',
    '$route.query.size': '$fetch',
    '$route.query.q': '$fetch'
  },
  layout: 'withsearchbar',
  mounted() {
    if (this.q) this.$store.commit('ADD_QUERY', { q: this.q })
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    createBarChartArray(markedString, finalArray, allWords) {
      const allLabels = allWords
      const final = finalArray
      // result will be an array of all words in between the <mark></mark> tags
      const result = markedString
        .match(/<mark>(.*?)<\/mark>/g)
        .map(function(value) {
          return value.replace(/<\/?mark>/g, '')
        })
      for (let c = 0; c < result.length; c++) {
        if (allLabels.includes(result[c])) {
          if (result[c] === this.$route.query.q) {
            this.querryFreq += 1
          }
          final[this.findWord(result[c], allLabels)].value += 1
        } else {
          if (result[c] === this.$route.query.q) {
            this.querryHigh = 0
            this.querryFreq += 1
          }
          allLabels.push(result[c])
          final.push({
            label: result[c],
            value: 1
          })
        }
      }
      return final
    },
    getFreq(result) {
      this.querryFreq = result
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
    },
    findWord(label, allLabels) {
      this.labels = allLabels
      for (let c = 0; c < allLabels.length; c++) {
        if (allLabels[c] === label) {
          return c
        }
      }
      return 0
    }
  }
}
</script>

<style scoped></style>
