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
        @rectClick="rectClick"
      ></HeatMapWrapperForAnalytics>
    </v-col>
    <v-col v-for="doc in documents" :key="doc._id" cols="4">
      <DocPortionWrapper
        :id="charts.heatmap2.id + doc._id"
        class="mb-2"
        :div-id="charts.heatmap2.divId + doc._id"
        :svg-id="charts.heatmap2.svgId + doc._id"
        :hover="false"
        :label="doc._source.path.virtual"
        :dataset="filteredDocuments(doc._id)"
        :chart-width="charts.heatmap2.width"
        :chart-height="charts.heatmap2.height"
        max-width="100%"
        @rectClick="rectClick"
      ></DocPortionWrapper>
    </v-col>
  </v-row>
</template>

<script>
import HeatMapWrapperForAnalytics from '~/components/HeatMap/HeatMapWrapperForAnalytics'
import DocPortionWrapper from '~/components/HeatMap/DocPortionWrapper'
export default {
  name: 'PageAnalyticsTiles',
  components: { DocPortionWrapper, HeatMapWrapperForAnalytics },
  layout: 'withsearchbar',
  async fetch() {
    const res = []
    const fullText = []
    for (const q of this.queries) {
      const tmp = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'file', 'path'],
          size: 100,
          query: {
            multi_match: {
              query: q.query,
              type: 'bool_prefix',
              fields: ['meta', 'content']
            }
          },
          highlight: {
            type: 'unified',
            order: 'score',
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              content: { number_of_fragments: 2000 }
            }
          }
        })
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          console.log(e)
          return {}
        })
      res.push({
        query: q.query,
        response: tmp
      })

      const tmp2 = await this.$axios
        .post('/api/literature/_search', {
          explain: true,
          sort: ['_score'],
          _source: ['meta', 'file', 'path'],
          size: 100,
          query: {
            multi_match: {
              query: q.query,
              type: 'bool_prefix',
              fields: ['meta', 'content']
            }
          },
          highlight: {
            type: 'unified',
            order: 'score',
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fields: {
              content: { number_of_fragments: 0 }
            }
          }
        })
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          console.log(e)
          return {}
        })
      fullText.push({
        query: q.query,
        response: tmp2
      })
    }
    this.responses = res
    this.fullTextResponses = fullText
  },
  data() {
    return {
      charts: {
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          svgId: 'heatmap-chart-svg-element',
          label: 'Concept intensity across documents',
          width: 300,
          height: 500
        },
        heatmap2: {
          id: 'heatmap2',
          divId: 'heatmap2-div',
          svgId: 'heatmap2-chart-svg-element',
          label: 'Positional concept intensity across documents',
          width: 300,
          height: 500
        }
      },
      responses: [],
      fullTextResponses: []
    }
  },
  computed: {
    documents() {
      const res = []
      for (const group of this.fullTextResponses)
        for (const doc of group.response.hits.hits) {
          if (!res.map((d) => d._id).includes(doc._id)) res.push(doc)
        }
      return res
    },
    filteredDocuments() {
      return (id) => {
        const res = []
        for (const group of this.fullTextResponses) {
          for (const doc of group.response.hits.hits)
            if (doc._id === id)
              res.push({
                query: group.query,
                response: doc
              })
        }
        return res
      }
    },
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
        // this.charts.heatmap.width = heatDiv.clientWidth - 30
        this.charts.heatmap.width = 300 + this.responses.length * 30
        this.charts.heatmap.height = this.heatmapHeight
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('width', this.charts.heatmap.width)
        document
          .getElementById(this.charts.heatmap.svgId)
          .setAttribute('height', this.charts.heatmap.height)
      }

      for (const doc of this.documents) {
        const heatDiv2 = document.getElementById(
          this.charts.heatmap2.divId + doc._id
        )
        if (heatDiv2) {
          console.log('found')
          // this.charts.heatmap.width = heatDiv.clientWidth - 30
          this.charts.heatmap2.width =
            400 + this.filteredDocuments(doc._id).length * 20
          this.charts.heatmap2.height = this.heatmapHeight
          document
            .getElementById(this.charts.heatmap2.svgId + doc._id)
            .setAttribute('width', this.charts.heatmap2.width)
          document
            .getElementById(this.charts.heatmap2.svgId + doc._id)
            .setAttribute('height', this.charts.heatmap2.height)
        }
      }
    },
    rectClick(item) {}
  }
}
</script>

<style scoped></style>
