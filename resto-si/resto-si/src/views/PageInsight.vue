<template>
  <div class="container">
    <h4>Beranda</h4>
    <br/>
    <div class="row">
      <div class="col pb-2">
        <div class="p-0 m-0">
            <h5 class="p-0 m-0"><b>Informasi Penjualan</b></h5>
            <div class="p-0 m-0">Periode {{startDate}} - {{endDate}}</div>
        </div>
      </div>
      <div class="col-12 col-sm-auto text-center p-2">
        <b-button-group size="sm">
          <b-button variant="info" class="button-primary" @click="getTransactionsInTimeSpan(0)">Hari</b-button>
          <b-button variant="info" class="button-primary" @click="getTransactionsInTimeSpan(1)">Minggu</b-button>
          <b-dropdown right text="Bulan" size="sm" variant="info" class="button-primary"> 
            <b-dropdown-item @click="getTransactionsInTimeSpan(2)">1 Bulan</b-dropdown-item>
            <b-dropdown-item @click="getTransactionsInTimeSpan(3)">3 Bulan</b-dropdown-item>
            <b-dropdown-item @click="getTransactionsInTimeSpan(4)">6 Bulan</b-dropdown-item>
          </b-dropdown>
          <b-button variant="info" class="button-primary" @click="getTransactionsInTimeSpan(5)">Tahun</b-button>
        </b-button-group>
      </div>
    </div>
 
    <InsightHeader 
      :totalIncome="toCurrencyFormat(income)" 
      :totalVisitor="transactionsByTime.length"
      :totalItem="totalItem"/>
      <div class="row">
        <div class="col-md-6  pt-4 ">
          <div class="p-2 box-shadow card-bg">
            <div class="p-3"><h5 class="f-semibold">Pendapatan {{chartTitle}}</h5></div>
            <InsightChartLine :data="chartData"/>
          </div>
        </div>
        <div class="col-md-6  pt-4 ">
          <div class="p-2 box-shadow card-bg">
            <div class="p-3"><h5 class="f-semibold">Pengunjung {{chartTitle}}</h5></div>
            <InsightChartBar :data="chartData" />
          </div>
        </div>
      </div>
      <div class="row  pt-4">
        <div class="col-12">
          <div class="p-2 box-shadow card-bg">
            <div class="p-3"><h5 class="f-semibold">Rincian Penjualan {{chartTitle}}</h5></div>
            <InsightChartFood :donutData="chartFoodData" :itemsCount="itemsCount"/>
          </div>
        </div>
      </div>
      <div class="row pt-4">
        <div class="col-12">
          <div class="p-2 box-shadow card-bg  pb-4 mb-4">
            <div class="p-3"><h5 class="f-semibold">Pasangan / Triplet Menu {{chartTitle}}</h5></div>
            <InsightTableMarketBasket :transactionsByTime="transactionsByTime"/>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import valueFormatter from '@/mixins/valueFormatter'
import InsightChartLine from '@/components/InsightChartLine.vue'
import InsightChartBar from '@/components/InsightChartBar.vue'
import InsightHeader from '@/components/InsightHeader.vue'
import InsightChartFood from '@/components/InsightChartFood.vue'
import InsightTableMarketBasket from '@/components/InsightTableMarketBasket.vue'
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  name: 'Insight',
  components: {
    InsightHeader,
    InsightChartLine,
    InsightChartBar,
    InsightChartFood,
    InsightTableMarketBasket
  },
  mixins: [valueFormatter],
  data(){
    return {
      isBusy: true,
      timeFlag: 1,
    }
  },
  computed: {
    ...mapGetters({
      transactionsByTime: 'transactions/transactionsTimed',
      income: 'transactions/transactionsIncomeTotal'
    }),
    itemsCount(){
      let items = {};
      [...Object.values({...this.transactionsByTime})].forEach(transaction => {
        [...Object.values(transaction.items)].forEach(item => {
          items[item.name] = {
            qty: (item.name in items ?  items[item.name].qty : 0) + item.qty
          }
        })
      })
      return items
    },
    chartData(){      
      const dup = [...Object.values({...this.transactionsByTime})].reduce((res, obj) => {
        res[obj.date] = { 
          income: (obj.date in res ? res[obj.date].income : 0) + obj.income,
          visitor: (obj.date in res ? res[obj.date].visitor : 0) + 1,
          timestamp: obj.date
        }

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

</style>