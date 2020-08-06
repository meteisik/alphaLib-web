<template>
  <v-card
    class="mx-auto"
    :outlined="null"
    :flat="flat"
    :hover="hover"
    :rounded="rounded"
    :max-width="maxWidth"
  >
    <v-card-title>
      {{ label }}
    </v-card-title>
    <v-card-text :id="divId">
      <heat-map
        :svg-id="svgId"
        :width="chartWidth"
        :height="chartHeight"
        :color-range="colorRange"
        :dataset="heatmapData"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import HeatMap from './TheHeatMap'
export default {
  name: 'HeatMapWrapper',
  components: {
    'heat-map': HeatMap
  },
  props: {
    id: {
      type: String,
      default: 'heatmap'
    },
    divId: {
      type: String,
      default: 'heatmap-div'
    },
    svgId: {
      type: String,
      default: 'heatmap-svg-element'
    },
    chartHeight: {
      type: Number,
      default: 100
    },
    chartWidth: {
      type: Number,
      default: 100
    },
    flat: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: true
    },
    rounded: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: '100%'
    },
    label: {
      type: String,
      default: 'This Amazing HeatMap'
    },
    dataset: {
      type: Array,
      default() {
        return []
      }
    }
  },
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
    this.responses = res
  },
  data() {
    return {
      colorRange: ['#b7e794', '#07bb0d'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      },
      charts: {
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          svgId: 'heatmap-chart-svg-element',
          label: 'Tiles',
          width: 100,
          height: 100
        }
      },
      responses: []
    }
  },
  computed: {
    heatmapData() {
      const res = []
      for (const transaction of this.responses) {
        for (const doc of transaction.response.hits.hits) {
          console.log('this is inside ' + transaction.response.hits.hits)
          console.log(doc._score)
          console.log(transaction.query)
          res.push({
            x: transaction.query,
            y: doc._source.path.virtual,
            value: doc._score
          })
        }
      }
      return res
    },
    queries() {
      return this.$store.state.searchQueries
    },
    heatmapHeight() {
      return 100
      // },
      // mounted() {
      //   this.resize()
      //   window.addEventListener('resize', this.resize)
    }
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
