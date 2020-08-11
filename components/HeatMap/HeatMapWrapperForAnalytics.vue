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
        :padding="{ top: 50, right: 10, left: 200, bottom: 10 }"
      ></heat-map>
    </v-card-text>
  </v-card>
</template>

<script>
import HeatMap from './TheHeatMap'
export default {
  name: 'HeatMapWrapperForAnalytics',
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
      default: 500
    },
    chartWidth: {
      type: Number,
      default: 300
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
  asyncData() {
    return {}
  },
  data() {
    return {
      colorRange: ['rgb(255,253,234)', '#ff5a08'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    heatmapData() {
      const res = []
      for (const transaction of this.dataset) {
        for (const doc of transaction.response.hits.hits) {
          res.push({
            x: transaction.query,
            y: doc._source.path.virtual,
            value: doc.highlight.content.length
          })
        }
      }
      return res
    }
  }
}
</script>
