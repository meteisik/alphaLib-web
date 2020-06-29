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
export default {
  name: 'TheGraph',
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
      colorScale: d3.scaleOrdinal(d3.schemeCategory10)
    }
  },
  computed: {},
  mounted() {
    // Store the locators
    this.svg = d3.select('#' + this.svgId)
    this.circles = d3.select('#circles-group')
    this.lines = d3.select('#lines-group')

    const drag = (simulation) => {
      function dragstarted(d) {
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
      .attr('r', 5)
      .attr('fill', (d) => this.colorScale(d.group))
      .call(drag(simulation))

    node.append('title').text((d) => d.id)
    node
      .append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text('test')

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
    })
  },
  methods: {}
}
</script>

<style scoped>
.node text {
  pointer-events: none;
  font: 10px sans-serif;
}
</style>
