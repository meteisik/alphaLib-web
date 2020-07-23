<!-- Wrapper is absolutely not ready, this is just a sketch -->
<template>
  <div>
    <bar-chart
      :svg-id="svgId"
      :chart-width="chartWidth"
      :chart-height="chartHeight"
      x-key="label"
      y-key="value"
      :data="sortedData"
    />
  </div>
</template>

<script>
import BarChart from './TheBarChart'
export default {
  name: 'BarChartWrapper',
  components: { BarChart },
  props: {
    svgId: {
      type: String,
      default: 'barchart-svg-element'
    },
    chartHeight: {
      type: Number,
      default: 300
    },
    chartWidth: {
      type: Number,
      default: 400
    },
    dataSet: {
      type: Array
    },
    xKey: {
      type: String,
      default: 'label'
    },
    yKey: {
      type: String,
      default: 'value'
    },
    reducedData: {
      type: Boolean,
      default: false
    }
  },
  asyncData() {
    return {}
  },
  // receive data from where the wrapper is placed
  data: () => ({}),
  computed: {
    // sort the data received
    sortedData() {
      let result = []
      for (const d of this.dataSet) {
        result.push({
          label: d[this.xKey],
          value: d[this.yKey]
        })
      }
      result = result.sort((a, b) => {
        return b[this.yKey] - a[this.yKey]
      })
      if (!this.reducedData || this.dataSet.length < 10) {
        return result
      } else {
        const resultReduced = []
        for (let i = 0; i < 10; i++) {
          resultReduced.push(result[i])
        }
        return resultReduced
      }
    }
  }
}
</script>
