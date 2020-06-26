<template>
  <v-row align="center" justify="start" no-gutters>
    <v-col cols="1" align-self="center">
      Queries...
      <ul>
        <li v-for="(q, i) in queries" :key="i">
          {{ q.query }}
        </li>
      </ul>
      <v-btn @click.stop="$fetch">Refresh</v-btn>
    </v-col>
    <v-col cols="11">
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
  </v-row>
</template>

<script>
import HeatMapWrapperForAnalytics from '~/components/HeatMap/HeatMapWrapperForAnalytics'
export default {
  name: 'PageAnalyticsIndex',
  components: { HeatMapWrapperForAnalytics },
  layout: 'withsearchbar',
  async fetch() {
    const res = []
    for (const q of this.queries) {
      const tmp = await this.$axios
        .get('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'path'],
          size: 1,
          query: {
            match: {
              content: {
                query: q.query
              }
            }
          },
          highlight: {
            type: 'unified',
            order: 'score',
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              content: { number_of_fragments: 1000 }
            }
          }
        })
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          return null
        })
      res.push({
        query: q.query,
        response: tmp
      })
    }
    console.log(res)
    this.responses = res
  },
  data() {
    return {
      charts: {
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          svgId: 'heatmap-chart-svg-element',
          label: 'Tiles',
          width: 300,
          height: 100
        }
      },
      responses: []
    }
  },
  computed: {
    queries() {
      return this.$store.state.searchQueries
    },
    heatmapHeight() {
      return 500
    }
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  methods: {
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
    }
  }
}
</script>

<style scoped></style>
