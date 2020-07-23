<template>
  <div id="container" class="svg-container" align="center">
    <svg :width="chartWidth" :height="chartHeight">
      <g :transform="'translate(' + getMargin.left + ',' + getMargin.top + ')'">
        <rect
          v-for="(point, index) in data"
          :key="index"
          class="rectangles"
          fill="#1fab89"
          :y="yScale(point[xKey])"
          :width="xScale(point[yKey])"
          :height="yScale.bandwidth()"
        ></rect>
        <g class="rightAxis" font-size="15">
          <text
            v-for="(point, index) in data"
            :key="'label-' + index"
            :x="xScale(point[yKey]) + 5"
            :y="yScale(point[xKey])"
            :transform="'translate(5,' + getMargin.bottom * 1.61 + ')'"
            dy="0.32em"
            font-size="10"
          >
            {{ point.label }}
          </text>
        </g>
        <g class="leftAxis" font-size="15">
          <text
            v-for="(point, index) in data"
            :key="'label-' + index"
            :y="yScale(point[xKey])"
            :transform="'translate(-5,' + getMargin.bottom * 1.61 + ')'"
            dy="0.32em"
            text-anchor="end"
            font-size="10"
          >
            {{ point.value }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
// import { axisRight, axisLeft } from 'd3'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max, min } from 'd3-array'
import { select } from 'd3-selection'
import 'd3-transition'

export default {
  name: 'BarChart',
  props: {
    title: String,
    xKey: String,
    yKey: String,
    data: Array,
    svgId: String,
    chartWidth: Number,
    chartHeight: Number,
    wordCounts: Array
  },
  data: () => ({
    svgWidth: 0,
    redrawToggle: true
  }),
  computed: {
    innerWidth() {
      return this.chartWidth - this.getMargin.left - this.getMargin.right
    },
    innerHeight() {
      return this.chartHeight - this.getMargin.top - this.getMargin.bottom
    },
    getMargin() {
      return {
        top: 0,
        right: this.chartWidth * 0.3,
        bottom: this.chartHeight * 0.03,
        left: this.chartWidth * 0.2
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
      // used for the length of each rect generated
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
    }
  },
  mounted() {
    this.putMargin()
    this.createLabels()
  },
  methods: {
    putMargin() {
      this.selectG.attr(
        'transform',
        `translate(${this.getMargin.left}, ${this.getMargin.top})`
      )
    },
    createLabels() {
      // erase axis and place labels on top of the bars
      this.selectG
        .select('.leftAxis')
        .select('path')
        .attr('style', 'display: none')
      this.selectG
        .select('.rightAxis')
        .select('path')
        .attr('style', 'display: none')
      this.selectG
        .select('.rightAxis')
        .selectAll('g')
        .select('text')
        .data(this.data)
        .attr('x', (d) => this.xScale(d[this.yKey]) + 5)
        .attr('class', 'rectLabel')
        .attr('dy', '0.32em')
    }
  }
}
</script>

<style scoped>
.rectangles {
  fill: orange;
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
