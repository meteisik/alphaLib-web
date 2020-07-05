<template>
  <div id="container" class="svg-container" align="center">
    <h1>{{ title }}</h1>
    <svg :width="svgWidth" :height="svgHeight">
      <g></g>
    </svg>
  </div>
</template>

<script>
import { axisLeft, axisRight } from 'd3'
import { scaleLinear, scaleBand } from 'd3-scale' // , scaleBand
import { max, min } from 'd3-array'
import { select } from 'd3-selection' // also import selection here if necessary
import 'd3-transition'

export default {
  name: 'BarChart',
  props: {
    title: String,
    xKey: String,
    yKey: String,
    data: Array
  },
  data: () => ({
    svgWidth: 0,
    redrawToggle: true
  }),
  computed: {
    innerWidth() {
      return this.svgWidth - this.getMargin.left - this.getMargin.right
    },
    innerHeight() {
      return this.svgHeight - this.getMargin.top - this.getMargin.bottom
    },
    getMargin() {
      return {
        top: 0,
        right: 20,
        bottom: 20,
        left: 80
      }
    },
    selectG() {
      return select('g')
    },
    dataMax() {
      // get the word with most occurences in the doc
      return max(this.data, (d) => {
        return d[this.yKey]
      })
    },
    dataMin() {
      // get the word with least occurences in the doc
      return min(this.data, (d) => {
        return d[this.yKey]
      })
    },
    xScale() {
      return scaleLinear()
        .domain([0, max(this.data, (d) => d[this.yKey])])
        .range([0, this.innerWidth])
    },
    yScale() {
      // in order to structure the bars in a vertical manner
      return scaleBand()
        .domain(this.data.map((d) => d[this.xKey]))
        .range([0, this.innerHeight])
    },
    yAxisData() {
      // in order to put frequency of words in the y axis on the left
      return scaleBand()
        .domain(this.data.map((d) => d[this.yKey]))
        .range([0, this.innerHeight])
    },
    svgHeight() {
      return this.svgWidth / 4 // change ratio to ratio of the sceen
    }
  },
  mounted() {
    this.svgWidth = document.getElementById('container').offsetWidth * 0.3
    this.createRectangles()
    this.putMargin()
    this.createAxis()
  },
  methods: {
    createRectangles() {
      this.selectG
        .selectAll('rect')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('y', (d) => this.yScale(d[this.xKey]))
        .attr('width', (d) => this.xScale(d[this.yKey]))
        .attr('height', this.yScale.bandwidth())
    },
    putMargin() {
      this.selectG.attr(
        'transform',
        `translate(${this.getMargin.left}, ${this.getMargin.top})`
      )
    },
    createAxis() {
      this.selectG.append('g').call(axisLeft(this.yAxisData))
      this.selectG.append('g').call(axisRight(this.yScale))
    }
  }
}
</script>

<style scoped>
.bar-positive {
  fill: orange;
  transition: r 0.2s ease-in-out;
}

.bar-positive:hover {
  fill: brown;
}

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 1%;
  vertical-align: top;
  overflow: hidden;
}
</style>
