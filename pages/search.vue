<template>
  <v-row align="start" justify="center" no-gutters>
    <v-col cols="7" align-self="start">
      <v-row no-gutters>
        <v-card
          v-for="(doc, i) in hits"
          :key="i + '-' + doc._id"
          class="mx-auto mb-2"
          width="100%"
          flat
          hover
          rounded
          link
          :to="'docs/' + doc._id"
        >
          <v-card-title class="primary--text">
            {{ doc._source.meta.title }}
          </v-card-title>
          <v-card-subtitle class="pb-md-0">
            {{ doc._source.file.filename }}
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li
                v-for="phrase in doc.highlight.content"
                :key="phrase"
                v-html="phrase"
              ></li>
            </ul>
            {{ doc._source.path.real }}
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
    <v-col cols="5" align-self="start">
      <TheInfoBox class="mb-2" max-width="90%" :hover="false"></TheInfoBox>
      <HeatMapWrapper
        :id="charts.heatmap.id"
        class="mb-2"
        :div-id="charts.heatmap.divId"
        :svg-id="charts.heatmap.svgId"
        :hover="false"
        :label="charts.heatmap.label"
        :dataset="hits"
        :chart-width="charts.heatmap.width"
        :chart-height="charts.heatmap.height"
        max-width="90%"
      ></HeatMapWrapper>
      <GraphWrapper
        :id="charts.conceptmap.id"
        class="mb-2"
        :div-id="charts.conceptmap.divId"
        :svg-id="charts.conceptmap.svgId"
        :hover="false"
        :label="charts.conceptmap.label"
        :dataset="hits"
        :chart-width="charts.conceptmap.width"
        :chart-height="charts.conceptmap.height"
        max-width="90%"
      ></GraphWrapper>
    </v-col>
  </v-row>
</template>

<script>
import TheInfoBox from '~/components/InfoBox/TheInfoBox'
import HeatMapWrapper from '~/components/HeatMap/HeatMapWrapper'
import GraphWrapper from '~/components/ConceptMap/GraphWrapper'
export default {
  name: 'PageSearch',
  components: { GraphWrapper, HeatMapWrapper, TheInfoBox },
  async asyncData({ query, $axios }) {
    const q = query.q
    const res = await $axios
      .post('/api/literature/_search', {
        explain: true,
        sort: ['_score'],
        _source: ['meta', 'file', 'path'],
        query: {
          multi_match: {
            query: q,
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
            content: { number_of_fragments: 5 }
          }
        }
      })
      .then((res) => {
        return res.data
      })
      .catch((e) => {
        return null
      })
    return { search: res }
  },
  layout: 'search',
  data: () => ({
    // Charts and all of their configurations
    charts: {
      heatmap: {
        id: 'heatmap',
        divId: 'heatmap-div',
        svgId: 'heatmap-chart-svg-element',
        label: 'Tiles',
        width: 500,
        height: 100
      },
      conceptmap: {
        id: 'conceptmap',
        divId: 'conceptmap-div',
        svgId: 'conceptmap-chart-svg-element',
        label: 'Concept Map',
        width: 500,
        height: 700
      }
    }
  }),
  computed: {
    q() {
      return this.$route.query.q
    },
    hits() {
      if (this.search === null) return []
      return this.search.hits.hits
    },
    heatmapHeight() {
      return 40 + this.hits.length * 5
    }
  },
  mounted() {
    this.$store.commit('ADD_QUERY', this.q)
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

      const conceptDiv = document.getElementById(this.charts.conceptmap.divId)
      if (conceptDiv) {
        this.charts.conceptmap.width = conceptDiv.clientWidth - 30
        document
          .getElementById(this.charts.conceptmap.svgId)
          .setAttribute('width', this.charts.conceptmap.width)
        document
          .getElementById(this.charts.conceptmap.svgId)
          .setAttribute('height', this.charts.conceptmap.height)
      }
    }
  }
}
</script>

<style scoped></style>
