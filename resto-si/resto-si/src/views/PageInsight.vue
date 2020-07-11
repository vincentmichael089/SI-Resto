<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Insight</h4>
      {{transactionsByTime}}
    </div>    
    <b-card  
    header-tag="header"  
    headerClass="mb-0 pb-1"
    style="margin: 1rem;"
    class="mb-2 ">
      <template v-slot:header>
        <div class="row">
          <div class="col">
            <div class="p-0 m-0">
                <h5 class="p-0 m-0"><b>Laporan Penjualan</b></h5>
                <small class="p-0 m-0">Periode {{startDate}} - {{endDate}}</small>
              </div>
          </div>
          <div class="col-12 col-sm-auto text-center p-2">
            <b-button-group size="sm">
              <b-button @click="getTransactionsInTimeSpan(0)">Hari</b-button>
              <b-button @click="getTransactionsInTimeSpan(1)">Minggu</b-button>
              <b-dropdown right text="Bulan" size="sm">
                <b-dropdown-item @click="getTransactionsInTimeSpan(2)">1 Bulan</b-dropdown-item>
                <b-dropdown-item @click="getTransactionsInTimeSpan(3)">3 Bulan</b-dropdown-item>
                <b-dropdown-item @click="getTransactionsInTimeSpan(4)">6 Bulan</b-dropdown-item>
              </b-dropdown>
              <b-button @click="getTransactionsInTimeSpan(5)">Tahun</b-button>
            </b-button-group>
          </div>
        </div>
      </template>
      <div class="container">
        <InsightHeader 
        :totalIncome="toCurrencyFormat(income)" 
        :totalVisitor="transactionsByTime.length"
        :totalItem="totalItem"/>
        <div class="row pt-lg-4">
          <div class="col-md-6">
            <div class="p-2 box-shadow">
              <strong>Pendapatan {{chartTitle}}</strong>
              <InsightChartLine :data="chartData"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2 box-shadow">
              <strong class="p-2">Pengunjung {{chartTitle}}</strong>
              <InsightChartBar :data="chartData" />
            </div>
          </div>
        </div>
        <div class="row pt-lg-4">
          <div class="col-12">
            <div class="p-2 box-shadow">
              <strong class="p-2">Rincian Penjualan</strong>
              <InsightChartFood :donutData="chartFoodData"/>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import valueFormatter from '@/mixins/valueFormatter'
import InsightChartLine from '@/components/InsightChartLine.vue'
import InsightChartBar from '@/components/InsightChartBar.vue'
import InsightHeader from '@/components/InsightHeader.vue'
import InsightChartFood from '@/components/InsightChartFood.vue'
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  name: 'Insight',
  components: {
    InsightHeader,
    InsightChartLine,
    InsightChartBar,
    InsightChartFood
  },
  mixins: [valueFormatter],
  data(){
    return {
      isBusy: true,
      timeFlag: 1
    }
  },
  computed: {
    ...mapGetters({
      transactionsByTime: 'transactions/transactionsTimed',
      income: 'transactions/transactionsIncomeTotal'
    }),
    chartData(){
      let items = {};
      [...Object.values({...this.transactionsByTime})].forEach(transaction => {
        [...Object.values(transaction.items)].forEach(item => {
          items[item.name] = {
            qty: (item.name in items ?  items[item.name].qty : 0) + item.qty
          }
        })
      })
      
      const dup = [...Object.values({...this.transactionsByTime})].reduce((res, obj) => {
        res[obj.date] = { 
          income: (obj.date in res ? res[obj.date].income : 0) + obj.income,
          visitor: (obj.date in res ? res[obj.date].visitor : 0) + 1,
          timestamp: obj.date,
          items: items
        }

        console.log(res)
        return res;
      }, {})

      return [...Object.values(dup)]
    },
    chartTitle(){
      let title
      switch(this.timeFlag){
        case 0: 
          title = 'Hari Ini'
          break;
        case 1:
          title = '1 Minggu Terakhir'
          break;
        case 2: 
          title = '1 Bulan Terakhir'
          break;
        case 3:
          title = '3 Bulan Terakhir'
          break;
        case 4: 
          title = '6 Bulan Terakhir'
          break;      
        case 5: 
          title = '1 Tahun Terakhir'
          break;                                  
      }

      return title
    },
    startDate(){
      let startDate
      switch(this.timeFlag){
        case 0: 
          startDate = moment().startOf('day').format('D MMMM YYYY')
          break;
        case 1:
          startDate = moment().subtract(1, 'weeks').format('D MMMM YYYY')
          break;
        case 2: 
          startDate = moment().subtract(1, 'months').format('D MMMM YYYY')
          break;
        case 3:
          startDate = moment().subtract(3, 'months').format('D MMMM YYYY')
          break;
        case 4: 
          startDate = moment().subtract(6, 'months').format('D MMMM YYYY')
          break;      
        case 5: 
          startDate = moment().subtract(1, 'years').format('D MMMM YYYY')
          break;                                  
      }
      return startDate
    },
    endDate(){
      return moment().endOf('day').format('D MMMM YYYY')
    },
    chartFoodData(){
      return [[...this.transactionsByTime].reduce( function(a, b){
          return a + b['countFoods'];
      }, 0),[...this.transactionsByTime].reduce( function(a, b){
          return a + b['countDrinks'];
      }, 0)]
    },
    totalItem(){
      return [...this.chartFoodData]. reduce(function(a, b){
        return a + b;
      }, 0);
    }
  },
  methods: {
    getTransactionsInTimeSpan(flag){
      this.isBusy = true
      this.timeFlag = flag
      this.$store.dispatch('transactions/fetchTimedTransactions', {flag: flag}).then(() => {
        this.isBusy = false
      })
    }
  },
  beforeCreate(){
    this.$store.dispatch('transactions/fetchTimedTransactions', {flag: 1}).then(() => {
      this.isBusy = false
    })
  }
}
</script>

<style>
.box-shadow{
  box-shadow: 0 2px 4px 0 rgba(62, 57, 107, 0.13);
}
</style>