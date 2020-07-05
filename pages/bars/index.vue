<!-- Page made for bar chart testing purposes only -->
<template>
  <div id="app">
    <BarChart
      title="Bar Chart Testing page"
      x-key="label"
      y-key="amount"
      :data="barChartData"
    />
  </div>
</template>

<script>
import BarChart from '../../components/BarCharts/TheBarChart'

export default {
  name: 'App',
  components: {
    BarChart
  },
  data: () => ({
    barChartData: [
      {
        label: 'ONE',
        amount: 25
      },
      {
        label: 'TWO',
        amount: 40
      },
      {
        label: 'THREE',
        amount: 15
      },
      {
        label: 'FOUR',
        amount: 9
      }
    ]
  })
}
</script>

<style>
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #282f36;
  margin-top: 30px;
}
</style>
