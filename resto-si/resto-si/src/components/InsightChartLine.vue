<template>
  <div>
    <apexchart height="150%" type="area" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import valueFormatter from '@/mixins/valueFormatter'

export default {
  name: 'ChartLine',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mixins: [valueFormatter],
  data: function() {
    return {
      options: {
        chart: {
          id: 'chart-income',
          //group: 'timed',
          type: 'area',
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          labels: {
            formatter: this.toCurrencyFormat
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
        },
        markers: {
          size: 4,
        }
      },
      series: [{
        name: "Pemasukan",
        data: [...this.data].map(datum => {
          return {
            x: datum.timestamp,
            y: datum.income
          }
        })
      }],
    }
  },
  watch: {
    data(){
      this.updateChart()
    }
  },
  methods: { 
    updateChart(){
      this.series = [{
        data: [...this.data].map(datum => {
          return {
            x: datum.timestamp,
            y: datum.income
          }
        })
      }]
    }
  },
  mounted() {
    this.updateChart()
  },
}
</script>

<style>

</style>