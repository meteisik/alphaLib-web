<template>
  <v-card
    class="mx-auto"
    :outlined="null"
    :flat="flat"
    :hover="hover"
    :rounded="rounded"
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
        :padding="{ top: 10, right: 10, left: 30, bottom: 10 }"
      >
      </heat-map>
    </v-card-text>
  </v-card>
</template>

<script>
import HeatMap from './TheHeatMap'
export default {
  name: 'DocPortionWrapper',
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
        const length = transaction.response.highlight.content[0].length
        const sectionSize = length / 10
        const segments =
          transaction.response.highlight.content[0].match(
            new RegExp('[\\s\\S]{1,' + sectionSize + '}', 'g')
          ) || []
        for (const i in segments) {
          console.log('this is i in segments' + JSON.stringify(this.i))
          res.push({
            x: transaction.query,
            y: i,
            value: (segments[i].match(/<mark>/g) || []).length
          })
        }
      }
      return res.reverse()
    }
  }
}
</script>
