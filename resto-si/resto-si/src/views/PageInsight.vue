<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Insight</h4>
    </div>    
    <b-card  
    header-tag="header"  
    style="margin: 1rem;"
    class="mb-2 ">
      <template v-slot:header>
        <table style="width: 100%">
          <tr>
            <td>
              <div>
                <h5><b>Laporan Penjualan</b></h5>
                <small>Periode {{startDate}} - {{endDate}}</small>
              </div>
            </td>
            <td style="text-align: right;">
              <div>
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
            </td>
          </tr>
        </table>
      </template>
      <div class="container">
        <InsightHeader :totalIncome="toCurrencyFormat(income)" :totalVisitor="transactionsIncomeByTime.length"/>
        <div class="row pt-4">
          <div class="col-md-6">
            <strong>Pendapatan {{chartTitle}}</strong>
            <AppChartLine :data="chartData" />
          </div>
          <div class="col-md-6">
            <strong>Pengunjung {{chartTitle}}</strong>
            <AppChartBar :data="chartData" />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import valueFormatter from '@/mixins/valueFormatter'
import AppChartLine from '@/components/AppChartLine.vue'
import AppChartBar from '@/components/AppChartBar.vue'
import InsightHeader from '@/components/InsightHeader.vue'
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  name: 'Insight',
  components: {
    InsightHeader,
    AppChartLine,
    AppChartBar
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
      transactionsIncomeByTime: 'transactions/transactionsIncomeTimed',
      income: 'transactions/transactionsIncomeTotal'
    }),
    chartData(){
      const dup = [...Object.values({...this.transactionsIncomeByTime})].reduce((res, obj) => {
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