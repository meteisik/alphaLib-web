<!-- Wrapper is absolutely not ready, this is just a sketch -->
<template>
  <bar-chart
    :svg-id="svgId"
    :width="chartWidth"
    :height="chartHeight"
    :color-range="colorRange"
    :dataset="heatmapData"
  />
</template>

<script>
import BarChart from './TheBarChart'
export default {
  name: 'BarChartWrapper',
  components: {
    'bar-chart': BarChart
  },
  props: {
    id: {
      type: String,
      default: 'barchart'
    },
    divId: {
      type: String,
      default: 'barchart-div'
    },
    svgId: {
      type: String,
      default: 'barchart-svg-element'
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
      colorRange: ['#b7e794', '#07bb0d'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    chartData() {
      // TODO: for each document and each query from $store.state.searchQueries
      return []
    }
  }
}
</script>
