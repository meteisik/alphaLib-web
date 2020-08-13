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
      <TheGraphForAnalytics
        :svg-id="svgId"
        :width="chartWidth"
        :height="chartHeight"
        :links="getQueryNodes.links"
        :nodes="getQueryNodes.allNodes"
        :dataset="this.dataset"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import TheGraphForAnalytics from '~/components/ConceptMap/TheGraphForAnalytics'
export default {
  name: 'GraphWrapperForAnalytics',
  components: { TheGraphForAnalytics },
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
      },
      HeatMapData: {
        que: '',
        docName: '',
        value: 0
      }
    }
  },
  data() {
    return {
      HeatMapData: {
        que: '',
        docName: '',
        value: 0,
        id: ''
      }
    }
  },
  computed: {
    getQueryNodes() {
      const queryNodes = []
      let allNodes = []
      const _dataset = this.dataset
      /* const range = [8, 20]
      const rangeMin = range[0]
      const frequencies = []
      const radii = []
      let frequenciesMin = 0
      let frequenciesMax = 0
       */
      const radii = []
      const docNodes = []
      const links = []
      let queryIdCounter = 5000
      if (this.dataset[0] === undefined) {
      } else {
        for (const d of _dataset) {
          // create an ordered array of the number of documents results for each query
          const index = _dataset.indexOf(d) // initial set
          radii[index] = d.response.hits.hits.length
          radii[index] = radii[index] / 2 + 5
        }
        /*
        frequencies[index] = d.frequency
      }
      frequencies.sort(function(a, b) {
        // sort frequencies
        return a - b
      })
      frequenciesMin = Math.min(...frequencies) // smallest frequency
      for (const d of frequencies) {
        const index = frequencies.indexOf(d)
        frequencies[index] -= frequenciesMin
      }
      frequenciesMax = Math.max(...frequencies)
      range[0] -= rangeMin
      range[1] -= rangeMin
      if (frequenciesMax === 0) {
        frequenciesMax = range[0] + range[1] / 2
      }
      let num = 0
      for (const d of frequencies) {
        const multiplier = d / frequenciesMax
        radii[num] = multiplier * range[1] + rangeMin
        num++
      } */
        for (const d of _dataset) {
          const index = _dataset.indexOf(d)
          // create query node
          queryNodes[index] = {
            title: d.query,
            group: 'Query',
            radius: radii[index],
            id: queryIdCounter
          }
          // create attached doc nodes
          for (const b of d.response.hits.hits) {
            let found = false
            if (docNodes.length !== 0) {
              // does docnode already exist?
              for (let i = 0; i < docNodes.length; i++) {
                if (docNodes[i].id.localeCompare(b._id) === 0) {
                  found = true
                  links[links.length] = {
                    // create link between query and exisrting docnode
                    source: queryNodes[index].id,
                    target: docNodes[i].id,
                    value: 2
                  }
                  break
                }
              }
            }
            if (!found) {
              // if doc node does not already exist, make a new one
              if (b._source.meta.title === undefined) {
                docNodes[docNodes.length] = {
                  id: b._id,
                  title: 'TITLE_UNDEFINED',
                  group: 'Undefined Title',
                  radius: 5
                }
              } else {
                docNodes[docNodes.length] = {
                  id: b._id,
                  title: b._source.meta.title,
                  group: 'Cited Works',
                  radius: 6
                }
              }
              links[links.length] = {
                // create respective link
                source: queryNodes[index].id,
                target: b._id,
                value: 2
              }
            }
          }
          queryIdCounter++
        }
      }
      allNodes = queryNodes.concat(docNodes)
      return { allNodes, links }
    }
  },
  methods: {}
}
</script>

<style scoped></style>
