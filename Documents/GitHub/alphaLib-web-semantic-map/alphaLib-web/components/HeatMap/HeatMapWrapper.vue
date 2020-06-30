<template>
  <v-card
    class="mx-auto"
    :outlined="outlined"
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
    heatmapData() {
      // TODO: for each document and each query from $store.state.searchQueries
      return [
        {
          y: 'doc1',
          x: 'q1',
          value: 20
        },
        {
          y: 'doc2',
          x: 'q1',
          value: 40
        },
        {
          y: 'doc3',
          x: 'q1',
          value: 25
        },
        {
          y: 'doc4',
          x: 'q1',
          value: 15
        },
        {
          y: 'doc1',
          x: 'q2',
          value: 40
        },
        {
          y: 'doc2',
          x: 'q2',
          value: 5
        },
        {
          y: 'doc3',
          x: 'q2',
          value: 17
        },
        {
          y: 'doc4',
          x: 'q2',
          value: 32
        }
      ]
    }
  }
}
</script>

<style scoped></style>
