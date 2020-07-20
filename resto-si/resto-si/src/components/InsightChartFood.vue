<template>
  <div>
    <div class="row">
      <div class="col-md-6 p-3">
        <apexchart height="95%" type="donut" :options="donutOptions" :series="donutSeries"></apexchart>
      </div>
      <div class="col-md-6 p-3">
        <apexchart type="bar" :options="barOptions" :series="barSeries"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartFood',
  props: {
    donutData: {
      type: Array,
      required: true
    },
    itemsCount: {
      type: Object,
      required: true
    },
  },
  data(){
    return {
      donutOptions: {
        chart: {
          id: 'chart-food',
          zoom: {
            enabled: false
          },
          
        },
        legend: {
          position: 'right'
        },
        labels: ['Makanan', 'Minuman'],
        plotOptions: {
          pie: {
            donut: {
              customScale: 2,
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
        },
        colors: ["#ff6178", "#8e78d7"],
       
      },
      donutSeries: [...this.donutData],
      barOptions: {
        chart: {
          id: 'chart-menus',
          zoom: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
             dataLabels: {
                  position: 'top', 
            },
          }
        },
        xaxis: {
          type: 'category'
        },
        yaxis: {},
        dataLabels: {
          enabled: true,
          offsetX: 20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        stroke: {
          curve: 'straight',
        },
        markers: {
          size: 4,
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        colors: ['#ec9f05'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#ff4e00'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom:1,
            opacityTo:1,
            stops: [0, 90, 100]
          },
        }
      },
      barSeries: [{
        name: "Jumlah",
        data: []
      }]
    }
  },
  watch: {
    donutData(){
      this.updateChart()
    },
  },
  computed: {
    barData(){
      let res = {};

      [...Object.entries(this.itemsCount)].forEach(item => {
        res[item[0]] = {
          x: item[0],
          y: (item[0] in res ?  res[item[0]].y : 0) + item[1].qty
        }
        // if(item[0] in res){
        //   res[item[0]].x = item[0]
        //   res[item[0]].y = res[item[0]].y + item[1].qty
        // }else{
        //   res[item[0]].y = 0 + item[1].qty
        // }
      })
    

      return Object.values(res).sort((a, b) => (a.y> b.y) ? -1 : 1)
    },
  },
  methods: { 
    updateChart(){
      this.donutSeries = [...this.donutData]
      this.barSeries = [{
        name: "Jumlah",
        data: [...this.barData].map(datum => {
          return {
            x: datum.x,
            y: datum.y
          }
        })
      }]
    },
  },
  mounted() {
    this.updateChart()
  },
}
</script>

<style>

</style>