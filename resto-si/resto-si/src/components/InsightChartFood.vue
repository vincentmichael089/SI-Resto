<template>
  <div>
    <apexchart width="100%" type="donut" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
export default {
  name: 'ChartFood',
  props: {
    donutData: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      options: {
        chart: {
          id: 'chart-food',
          zoom: {
            enabled: false
          }
        },
        labels: ['Makanan', 'Minuman'],
        plotOptions: {
          pie: {
            donut: {
              size: '60%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total',
                },
                value: {
                  show: true
                }
              },
            }
          }
        }
      },
      series: [...this.donutData],
    }
  },
  watch: {
    donutData(){
      this.updateChart()
    }
  },
  methods: { 
    updateChart(){
      this.series = [...this.donutData]
    }
  },
  mounted() {
    this.updateChart()
  },
}
</script>

<style>

</style>