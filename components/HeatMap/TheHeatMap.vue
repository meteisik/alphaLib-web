<template>
  <svg :id="svgId" :width="width" :height="height" class="svg heatmap">
    <g id="rects">
      <rect
        v-for="item in dataset"
        :key="JSON.stringify(item)"
        :x="xScale(item.x)"
        :y="yScale(item.y)"
        :width="xScale.bandwidth()"
        :height="yScale.bandwidth()"
        :style="'fill: ' + colorScale(item.value) + ';'"
        class="rect"
      ></rect>
    </g>
    <g
      :class="'x-axis heatmap-' + svgId + '-x-axis'"
      :transform="'translate(0,' + chartTop + ')'"
    ></g>
    <g
      :class="'y-axis heatmap-' + svgId + '-y-axis'"
      :transform="'translate(' + chartLeft + ', 0)'"
    ></g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'TheHeatMap',
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
    dataset: {
      type: Array,
      default() {
        return []
      }
    },
    colorRange: {
      type: Array,
      default() {
        return ['#e7d008', '#e70546']
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
      circlesGroup: null,
      axes: {
        x: {
          padding: 0.01,
          element: null
        },
        y: {
          padding: 0.01,
          element: null
        }
      }
    }
  },
  computed: {
    chartLeft() {
      return this.padding.left
    },
    chartRight() {
      return this.width - this.padding.right
    },
    chartBottom() {
      return this.height - this.padding.bottom
    },
    chartTop() {
      return this.padding.top
    },
    chartHeight() {
      return this.chartBottom - this.chartTop
    },
    chartWidth() {
      return this.chartRight - this.chartLeft
    },
    xScale() {
      return d3
        .scaleBand()
        .domain(this.dataset.map((d) => d.x).sort())
        .range([this.chartLeft, this.chartRight])
        .padding(this.axes.x.padding)
    },
    yScale() {
      return d3
        .scaleBand()
        .domain(this.dataset.map((d) => d.y).sort())
        .range([this.chartBottom, this.chartTop])
        .padding(this.axes.y.padding)
    },
    colorScale() {
      return d3
        .scaleLinear()
        .range(this.colorRange)
        .domain([
          d3.min(this.dataset, function(d) {
            return d.value
          }),
          d3.max(this.dataset, function(d) {
            return d.value
          })
        ])
    },
    xAxisFunction() {
      return d3.axisTop(this.xScale)
    },
    yAxisFunction() {
      return d3.axisLeft(this.yScale)
    }
  },
  beforeUpdate() {
    // re-draw axes
    this.drawAxes()
  },
  mounted() {
    // Setup the SVG and Groups
    this.setupSVG()
  },
  methods: {
    setupSVG() {
      // Select the SVG element
      this.svg = d3.select('.heatmap')
      this.circlesGroup = d3.select('#rects')
      this.axes.x.element = d3.select('.heatmap-' + this.svgId + '-x-axis')
      this.axes.y.element = d3.select('.heatmap-' + this.svgId + '-y-axis')
    },
    drawAxes() {
      // Draw X axis
      this.axes.x.element
        .call(this.xAxisFunction)
        .selectAll('text')
        .attr('class', 'body-1')

      // Draw Y axis
      this.axes.y.element
        .call(this.yAxisFunction)
        .selectAll('text')
        .attr('class', 'body-1')
    }
  }
}
</script>

<style scoped>
.x-axis >>> .tick,
.y-axis >>> .tick {
  font-family: 'Roboto', sans-serif;
}
</style>
