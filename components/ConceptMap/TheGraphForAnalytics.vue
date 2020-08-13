<template>
  <svg
    :id="svgId"
    :width="width"
    :height="height"
    class="svg concept-map"
    :viewBox="[-width / 2, -height / 2, width, height]"
  >
    <!--    <g id="lines-group" stroke="#999" stroke-opacity="0.6">-->
    <!--      <line-->
    <!--        v-for="(link, index) in links"-->
    <!--        :key="index"-->
    <!--        :stroke-width="Math.sqrt(link.value)"-->
    <!--        :x1="link.source.x"-->
    <!--        :x2="link.target.x"-->
    <!--        :y1="link.source.y"-->
    <!--        :y2="link.target.y"-->
    <!--      ></line>-->
    <!--    </g>-->
    <!--    <g id="circles-group" stroke="#fff" stroke-width="1.5">-->
    <!--      <circle-->
    <!--        v-for="(node, index) in nodes"-->
    <!--        :key="index"-->
    <!--        :r="5"-->
    <!--        :cx="node.x"-->
    <!--        :cy="node.y"-->
    <!--        :fill="colorScale(node.group)"-->
    <!--        :stroke-width="Math.sqrt(nodes.value)"-->
    <!--      >-->
    <!--        <title>{{ node.id }}</title>-->
    <!--      </circle>-->
    <!--    </g>-->
  </svg>
</template>
<script>
import * as d3 from 'd3'
import { eventBus } from '@/plugins/bus.js'
export default {
  name: 'TheGraphForAnalytics',
  plugins: {
    eventBus
  },
  props: {
    svgId: {
      type: String,
      default: 'heat-map'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    links: {
      type: Array,
      default() {
        return []
      }
    },
    nodes: {
      type: Array,
      default() {
        return []
      }
    },
    padding: {
      type: Object,
      default() {
        return {
          top: 25,
          right: 2,
          left: 70,
          bottom: 2
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      circles: null,
      lines: null,
      colorScale: d3.scaleOrdinal(d3.schemeCategory10),
      HeatMapData: {
        que: '',
        docName: '',
        value: 0
      }
    }
  },
  computed: {},
  watch: {
    nodes() {
      // select all circles and links (using their shared class)
      // remove them, then redraw them
      d3.selectAll('circle').remove()
      d3.selectAll('line').remove()
      this.loadGraph()
    }
  },
  mounted() {
    this.loadGraph()
  },
  created() {
    eventBus.$on('rectClickFromHeatMap', (data) => {
      if (data != null) {
        this.HeatMapData.que = data.x
        this.HeatMapData.docName = data.y
        this.HeatMapData.value = data.value
        this.HeatMapData.idDoc = data.id
      }
    })
    eventBus.$on('hoverHighlightFromHeatMap', (data) => {
      if (data != null) {
        this.HeatMapData.que = data.x
        this.HeatMapData.docName = data.y
        this.HeatMapData.value = data.value
        this.HeatMapData.idDoc = data.id
        this.nodeHighlight(
          this.HeatMapData.que,
          this.HeatMapData.idDoc,
          this.HeatMapData.docName,
          this.HeatMapData.value
        )
      }
    })
    eventBus.$on('nodeHighlightOff', (data) => {
      if (data != null) {
        this.HeatMapData.que = data.x
        this.HeatMapData.docName = data.y
        this.HeatMapData.value = data.value
        this.HeatMapData.idDoc = data.id
        this.nodeHighlightOff(
          this.HeatMapData.que,
          this.HeatMapData.idDoc,
          this.HeatMapData.docName,
          this.HeatMapData.value
        )
      }
    })
  },
  methods: {
    sendHoverOut(item) {
      console.log(
        'highlight sent out from graphforanalytics: ' + JSON.stringify(item)
      )
      eventBus.$emit('hoverFromConceptMap', item)
    },
    nodeHighlight(query, idDoc, docName, value) {
      if (this.nodes !== undefined) {
        for (const node of this.nodes) {
          if (node.title === query) {
            node.group = 'Selected Query'
            d3.selectAll('circle').remove()
            d3.selectAll('line').remove()
            this.loadGraph()
          }
          if (node.id === idDoc) {
            node.group = 'Selected Cited Works'
            d3.selectAll('circle').remove()
            d3.selectAll('line').remove()
            this.loadGraph()
          }
        }
      }
    },
    nodeHighlightOff(query, idDoc, docName, value) {
      if (this.nodes !== undefined) {
        for (const node of this.nodes) {
          if (node.title === query) {
            node.group = 'Query'
            d3.selectAll('circle').remove()
            d3.selectAll('line').remove()
            this.loadGraph()
          }
          if (node.id === idDoc) {
            node.group = 'Cited Works'
            d3.selectAll('circle').remove()
            d3.selectAll('line').remove()
            this.loadGraph()
          }
        }
      }
    },
    loadGraph() {
      // Store the locators
      d3.selectAll('circle').remove()
      d3.selectAll('line').remove()
      this.svg = d3.select('#' + this.svgId)
      this.circles = d3.select('#circles-group')
      this.lines = d3.select('#lines-group')
      const drag = (simulation) => {
        function dragstarted(d) {
          console.log(d.title)
          if (!d3.event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }
        function dragged(d) {
          d.fx = d3.event.x
          d.fy = d3.event.y
        }
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }
        return d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      }
      const simulation = d3
        .forceSimulation(this.nodes)
        .force(
          'link',
          d3.forceLink(this.links).id((d) => d.id)
        )
        .force('charge', d3.forceManyBody())
        .force('x', d3.forceX())
        .force('y', d3.forceY())
      // todo: add labels
      const link = this.svg
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr('stroke-width', (d) => Math.sqrt(d.value))
      const node = this.svg
        .append('g')
        .attr('stroke', 'context-stroke')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(this.nodes)
        .join('circle')
        .attr('r', (d) => d.radius)
        .attr('fill', (d) => this.colorScale(d.group))
        .on('mouseover', (d) => this.sendHoverOut(d))
        // .on('click', function(d) {
        //   d3.select(this)
        //     .call(this.sendHoverIn(d))
        //     .style({ opacity: '0.8' })
        //   d3.select('text').style({ opacity: '1.0' })
        // })
        // .on('mouseout', function(d) {
        //   d3.select(this)
        //     .call(this.sendHoverOut(d))
        //     .style({ opacity: '0.0' })
        //   d3.select('text').style({ opacity: '0.0' })
        // })
        .call(drag(simulation))
      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)
        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
      })
    }
  }
}
</script>
<style scoped></style>
