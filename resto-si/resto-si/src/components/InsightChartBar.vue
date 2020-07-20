<template>
  <div>
    <apexchart height="150%" type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import valueFormatter from '@/mixins/valueFormatter'

export default {
  name: 'ChartBar',
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
          id: 'chart-visitor',
          //group: 'timed',
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {},
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
        },
        markers: {
          size: 4,
        },
        colors: ['#045de9'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#09c6f9'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom:1,
            opacityTo:1,
            stops: [0, 90, 100]
          },
        }
      },
      series: [{
        name: "Pengunjung",
        data: [...this.data].map(datum => {
          return {
            x: datum.timestamp,
            y: datum.visitor
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
            y: datum.visitor
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