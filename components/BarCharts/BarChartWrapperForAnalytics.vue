<template>
  <v-card
    class="mx-auto"
    :outlined="outlined"
    :flat="flat"
    :rounded="rounded"
    :max-width="maxWidth"
  >
    <v-card-title>
      {{ label }}
    </v-card-title>
    <v-card-text :id="divId">
      <bar-chart
        :svg-id="svgId"
        :chart-width="chartWidth"
        :chart-height="graphHeight"
        x-key="label"
        y-key="value"
        :data="barChartData"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import BarChart from './TheBarChart'
export default {
  name: 'BarChartWrapperForAnalytics',
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
    },
    rounded: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: '100%'
    },
    hover: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    divId: {
      type: String,
      default: 'barchart-div'
    },
    label: {
      type: String,
      default: 'Bar Graph for words'
    }
  },
  asyncData() {
    return {}
  },
  // receive data from where the wrapper is placed
  data: () => ({}),
  computed: {
    // sort the data received
    // sortedData() {
    //   let result = []
    //   for (const d of this.dataSet) {
    //     result.push({
    //       label: d[this.xKey],
    //       value: d[this.yKey]
    //     })
    //   }
    //   result = result.sort((a, b) => {
    //     return b[this.yKey] - a[this.yKey]
    //   })
    //   if (!this.reducedData || this.dataSet.length < 10) {
    //     return result
    //   } else {
    //     const resultReduced = []
    //     for (let i = 0; i < 10; i++) {
    //       resultReduced.push(result[i])
    //     }
    //     return resultReduced
    //   }
    // },
    barChartData() {
      let res = []
      const queries = []
      let index = 0
      for (const transaction of this.dataSet) {
        for (const doc of transaction.response.hits.hits) {
          if (!queries.includes(transaction.query)) {
            res.push({
              label: transaction.query,
              value: doc.highlight.content.length
            })
            queries.push(transaction.query)
          } else {
            // add the length to the object so that we have one obj of the query
            index = this.findWord(transaction.query, res)
            res[index].value += doc.highlight.content.length
          }
        }
      }
      // return res already sorted
      res = res.sort((a, b) => {
        return b[this.yKey] - a[this.yKey]
      })
      console.log(res)
      return res
    },
    graphHeight() {
      if (this.dataSet.length <= 3) {
        return 100
      } else {
        return 400
      }
    }
  },
  methods: {
    findWord(matchWord, objArray) {
      for (let c = 0; c < objArray.length; c++) {
        if (objArray[c] === matchWord) {
          return c
        }
      }
      return 0
    }
  }
}
</script>
